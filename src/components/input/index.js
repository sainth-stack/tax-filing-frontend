// CustomInput.js
import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomInput = ({
  type,
  id,
  label,
  onChange,
  value,
  placeholder,
  className,
  style,
  labelStyles,
  readOnly,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col relative ${className}`}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
        {/* {required && <span className="text-red-500">*</span>} */}
      </label>
      <div className={type === "password" && "relative"} style={{ zIndex: 20 }}>
        <input
          type={
            type === "password" && !showPassword
              ? "password"
              : type === "password"
              ? "text"
              : type
          }
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="border rounded p-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          style={{ ...style }}
          readOnly={readOnly}
        />
        {type === "password" && (
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
