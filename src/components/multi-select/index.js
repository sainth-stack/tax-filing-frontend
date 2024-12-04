import React from "react";
import Select from "react-select";
import CustomOption from "./CustomOption"; // Adjust the path as needed

const MultiSelectInput = ({
  id,
  label,
  options,
  value,
  onChange,
  isDisabled,
}) => {
  // Custom styles for the Select component
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #007bff",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "5px",
      padding: "2px 5px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "red",
        color: "white",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#f0f0f0"
        : null,
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#007bff",
      },
    }),
  };

  return (
    <div className="flex flex-col mb-2">
      <label className="mb-2">{label}</label>
      <Select
        isMulti
        id={id}
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        styles={customStyles}
        classNamePrefix="select"
        placeholder="Select options..."
        components={{ Option: CustomOption }} // Use CustomOption with checkbox
      />
    </div>
  );
};

export default MultiSelectInput;
