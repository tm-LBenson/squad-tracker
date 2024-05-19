const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const client = new twilio(accountSid, authToken);
console.log('Sid', accountSid);
console.log('Auth Token', authToken);

exports.scheduledFieldCheck = functions.pubsub
  .schedule('every 180 minutes')
  .onRun(async (context) => {
    const now = new Date();

    const soldiersSnapshot = await admin
      .firestore()
      .collection('soldiers')
      .get();
    await Promise.all(
      soldiersSnapshot.docs.map(async (doc) => {
        const soldier = doc.data();
        const squadLeaderDoc = await admin
          .firestore()
          .collection('users')
          .doc(soldier.squadLeaderId)
          .get();
        const squadLeader = squadLeaderDoc.data();

        const templateDoc = await admin
          .firestore()
          .collection('templates')
          .doc(soldier.squadLeaderId)
          .get();
        const templateFields = templateDoc.data().fields;

        await Promise.all(
          templateFields.map(async (field) => {
            if (field.notification === 'SMS' && field.name in soldier.data) {
              const fieldValue = new Date(soldier.data[field.name]);
              const daysDifference = Math.floor(
                (fieldValue - now) / (1000 * 60 * 60 * 24),
              );

              console.log(
                `Field '${field.name}' for soldier '${
                  soldier.data['Full Name']
                }' is set to '${
                  soldier.data[field.name]
                }'. Notification period is '${
                  field.notificationPeriod
                }' days. Days difference is ${daysDifference} days.`,
              );

              if (daysDifference <= field.notificationPeriod) {
                const message = `Field '${field.name}' for soldier '${soldier.data['Full Name']}' is due in ${daysDifference} days.`;
                console.log(`Preparing to send SMS: ${message}`);
                try {
                  const response = await client.messages.create({
                    body: message,
                    from: functions.config().twilio.phone_number,
                    to: squadLeader.phoneNumber,
                  });
                  console.log(
                    `SMS sent to ${squadLeader.phoneNumber}: ${response.sid}`,
                  );
                } catch (error) {
                  console.error(
                    `Failed to send SMS to ${squadLeader.phoneNumber}:`,
                    error,
                  );
                }
              } else {
                console.log(
                  `Field '${field.name}' for soldier '${soldier.data['Full Name']}' is not within the notification period.`,
                );
              }
            }
          }),
        );
      }),
    );
  });
