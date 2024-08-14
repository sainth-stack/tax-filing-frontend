/* import React from "react";

const SelectInput = ({
  id,
  label,
  options,
  value,
  onChange,
  required,
  className,
  style,
  labelStyles,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
      </label>
      <select
        id={id}
        value={value || ""}
        onChange={onChange}
        className="border rounded p-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        // required={required}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
 */

// SelectInput.js
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
  disabled,
}) => {
  console.log(defaultValue)
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1" style={{ ...labelStyles }}>
        {label}
      </label>
      <select
        id={id}
        value={value || defaultValue ||''}
        onChange={onChange}
        className="border rounded p-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        // required={required}
        // defaultValue={defaultValue}
      >
        <option value="" disabled>
          Select an option
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
