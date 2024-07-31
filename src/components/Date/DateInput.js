import React from "react";

const DateInput = ({
  id,
  type,
  label,
  value,
  onChange,
  required,
  className = "",
  labelStyles = {},
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1" style={labelStyles}>
        {label}
        {/* {required && <span className="text-red-500">*</span>} */}
      </label>
      {type && type === "date" ? (
        <input
          type="date"
          id={id}
          value={value}
          onChange={onChange}
          className="border rounded p-[7px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      ) : (
        <h1>hi</h1>
      )}
    </div>
  );
};

export default DateInput;
