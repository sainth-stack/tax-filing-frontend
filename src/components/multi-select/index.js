// MultiSelectInput.js
import React from "react";
import Select from "react-select";

const MultiSelectInput = ({ label, options, value, onChange, isDisabled }) => {
  // Custom styles for the Select component
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #ccc',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #007bff', // Change border color on hover
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '5px',
      padding: '2px 5px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'red',
        color: 'white',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensures the dropdown overlaps other elements
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px', // Set max height for dropdown
      overflowY: 'auto', // Enable scrolling if content is too long
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f0f0f0' : null,
      color: state.isSelected ? 'white' : 'black',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#007bff', // Active option background color
      },
    }),
  };

  return (
    <div className="flex flex-col mb-2">
      <label className="mb-2">{label}</label>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        styles={customStyles} // Apply custom styles
        classNamePrefix="select"
        placeholder="Select options..."
      />
    </div>
  );
};

export default MultiSelectInput;
