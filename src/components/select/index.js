// components/SelectInput.js
import React from 'react';

const SelectInput = ({ id, label, options, value, onChange, required, className,style,labelStyles }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1" style={{...labelStyles}}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value || ''}
        onChange={onChange}
        className="border rounded p-[7px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;