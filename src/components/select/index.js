import React from "react";

const SelectInput = ({
  id,
  label,
  options,
  value,
  defaultValue,
  onChange,
  required,
  className,
  style,
  labelStyles,
  default1,
  disabled,
  readOnly,
  name,
  isMultiple // New prop to control multiple selection
}) => {
  return (
    <div className={`flex flex-col ${className}`} style={style}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
      </label>
      <select
        id={id}
        value={value || defaultValue || (isMultiple ? [] : "")} // Handle value for multiple selection
        onChange={onChange}
        disabled={readOnly}
        name={name}
        className="border rounded p-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        multiple={isMultiple} // Enable multiple selection based on prop
      >
        <option value="" disabled>
          {default1 || 'Select an option'}
        </option>
        {options?.map((option, index) => (
          <option key={index} value={option?.value}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
