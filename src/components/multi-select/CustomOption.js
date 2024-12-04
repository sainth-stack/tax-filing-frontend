import { components } from "react-select";

const CustomOption = (props) => {
  const handleCheckboxChange = (e) => {
    const { value } = props.data; // Get the value of the current option
    const isSelected = e.target.checked; // Check if the checkbox is selected

    const updatedValue = isSelected
      ? [...props.selectProps.value, value] // Add value if selected
      : props.selectProps.value.filter((item) => item !== value); // Remove value if deselected

    props.selectProps.onChange(updatedValue); // Update selected values
  };

  return (
    <components.Option {...props}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{props.label}</span>
        <input
          type="checkbox"
          checked={props.isSelected} // Determine if the option is selected
                  onChange={() =>
                      null} // Handle the checkbox change
        />
      </div>
    </components.Option>
  );
};

export default CustomOption;
