// components/CustomInput.js
import React from 'react';

const CustomInput = ({ type, id, label, required, onChange, value, placeholder, className,style,labelStyles }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1" style={{...labelStyles}}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded p-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
        style={{
            ...style
        }}
      />
    </div>
  );
};

export default CustomInput;
