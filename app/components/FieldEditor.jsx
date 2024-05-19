import React from 'react';

const notificationTypes = ['None', 'SMS'];
const notificationPeriods = [30, 60, 90];

const FieldEditor = ({
  field,
  index,
  fields,
  setFields,
  handleNotificationChange,
  confirmRemoveField,
}) => {
  return (
    <>
      <input
        type="text"
        value={field.name}
        onChange={(e) => {
          if (field.editable) {
            const newFields = [...fields];
            newFields[index].name = e.target.value;
            setFields(newFields);
          }
        }}
        placeholder="Field Name"
        className={
          field.editable
            ? 'px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2 text-black'
            : 'px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2 text-slate-400'
        }
        disabled={!field.editable}
      />
      <select
        value={field.type}
        onChange={(e) => {
          if (field.editable) {
            const newFields = [...fields];
            newFields[index].type = e.target.value;
            setFields(newFields);
          }
        }}
        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
        disabled={!field.editable}
      >
        <option value="text">Text</option>
        <option value="date">Date</option>
      </select>
      <select
        value={field.notification}
        onChange={(e) => handleNotificationChange(index, e.target.value)}
        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
      >
        {notificationTypes.map((type) => (
          <option
            key={type}
            value={type}
          >
            {type}
          </option>
        ))}
      </select>
      <select
        value={field.notificationPeriod}
        onChange={(e) => {
          if (field.editable) {
            const newFields = [...fields];
            newFields[index].notificationPeriod = e.target.value;
            setFields(newFields);
          }
        }}
        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
        disabled={!field.editable}
      >
        {notificationPeriods.map((period) => (
          <option
            key={period}
            value={period}
          >
            {period} days
          </option>
        ))}
      </select>
      <label className="flex items-center mr-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => {
            if (field.editable) {
              const newFields = [...fields];
              newFields[index].required = e.target.checked;
              setFields(newFields);
            }
          }}
          className="mr-1"
          disabled={!field.editable}
        />
        Required
      </label>
      {field.editable ? (
        <button
          onClick={() => confirmRemoveField(index)}
          className="p-2 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      ) : (
        <button
          className="p-2 bg-slate-400 text-white rounded"
          disabled
        >
          Remove
        </button>
      )}
    </>
  );
};

export default FieldEditor;
