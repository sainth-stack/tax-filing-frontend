import React, { useState } from 'react';

const CustomInput = ({ type, id, label, required, onChange, value, placeholder, className, style, labelStyles }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col relative ${className}`}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
        {/* {required && <span className="text-red-500">*</span>} */}
      </label>
      <div className="relative">
        <input
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          id={id}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="border rounded p-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          // required={required}
          style={{
            ...style
          }}
        />
        {type === 'password' && (
          <span 
            className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.06 10.06 0 0112 19c-4.477 0-8.268-2.943-9.542-7C3.732 7.943 7.523 5 12 5c.676 0 1.338.065 1.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 18.364a9.978 9.978 0 001.364-1.364M4.636 4.636A9.978 9.978 0 003 12c1.274 4.057 5.064 7 9.542 7 .534 0 1.062-.036 1.575-.107M16.95 7.05A9.978 9.978 0 0117.636 12m-1.757 4.243a10.061 10.061 0 002.121-2.121"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
