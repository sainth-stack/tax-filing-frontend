
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TextArea = ({
  type,
  id,
  label,
  required,
  onChange,
  value,
  placeholder,
  className,
  style,
  labelStyles,
  disabled,
  name
}) => {
  return (
    <div className={`flex flex-col relative ${className}`}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
        {/* {required && <span className="text-red-500">*</span>} */}
      </label>
      <div style={{ zIndex: 20 }}>
        <textarea
          id={id}
          value={value || ""}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="border rounded p-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          // required={required}
          style={{ ...style }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TextArea;
