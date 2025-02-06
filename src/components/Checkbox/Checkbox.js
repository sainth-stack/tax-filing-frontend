// components/CustomCheckbox.js
import React from "react";

const CustomCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required,
  className,
  style,
  disabled,
  labelStyles,
  name
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        disabled={disabled}
        type="checkbox"
        id={id}
        checked={checked}
        style={{
          width: "18px", // Adjust size here
          height: "18px", // diAdjust size here
          cursor: "pointer",
          ...style,
        }}
        name
        onChange={onChange}
        className="border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
        required={required}
      />
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
