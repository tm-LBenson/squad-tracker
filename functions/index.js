const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
require('dotenv').config();

admin.initializeApp();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

exports.scheduledFieldCheck = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const today = new Date();

    const soldiersSnapshot = await admin
      .firestore()
      .collection('soldiers')
      .get();

    for (const soldierDoc of soldiersSnapshot.docs) {
      const soldierData = soldierDoc.data().data;
      const squadLeaderId = soldierDoc.data().squadLeaderId;

      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(squadLeaderId)
        .get();
      if (!userDoc.exists) {
        console.error(`No user found with ID: ${squadLeaderId}`);
        continue;
      }
      const phoneNumber = userDoc.data().phoneNumber;
      if (!phoneNumber) {
        console.error(`No phone number found for user ID: ${squadLeaderId}`);
        continue;
      }

      const templateDoc = await admin
        .firestore()
        .collection('templates')
        .doc(squadLeaderId)
        .get();
      if (templateDoc.exists) {
        const fields = templateDoc.data().fields;

        for (const field of fields) {
          if (field.notification === 'SMS' && field.type === 'date') {
            const fieldValue = soldierData[field.name];
            const fieldDate = new Date(fieldValue);
            const diffTime = fieldDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= field.notificationPeriod) {
              const message = `Reminder: Field '${field.name}' for soldier ${soldierData['Full Name']} is set to ${fieldValue}.`;

              try {
                const messageResponse = await twilioClient.messages.create({
                  body: message,
                  from: process.env.TWILIO_PHONE_NUMBER,
                  to: phoneNumber, // Squad leader's phone number
                });
                console.log('Notification sent:', messageResponse.sid);
              } catch (error) {
                console.error('Error sending notification:', error);
              }
            }
          }
        }
      }
    }

    return null;
  });
