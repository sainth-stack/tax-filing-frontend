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
  labelStyles,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
        required={required}
        style={style}
      />
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
