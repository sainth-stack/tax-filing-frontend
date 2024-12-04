import { components } from "react-select";

const CustomOption = (props) => {
  const handleCheckboxChange = (e) => {
    // Get the value of the option
    const { value } = props.data;
    const isSelected = e.target.checked;

    // Update the selected values based on checkbox status
    const updatedValue = isSelected
      ? [...props.selectProps.value, value] // Add to selected options
      : props.selectProps.value.filter((item) => item !== value); // Remove from selected options

    // Pass the updated value back to the parent component
    props.selectProps.onChange(updatedValue);
  };

  return (
    <components.Option {...props}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          boxShadow: "1px 1px 1px gray",
          padding: ".3rem",
          borderRadius: ".5rem",
        }}
      >
        <span
          style={{
            fontWeight: "400",
            marginLeft: ".5rem",
          }}
        >
          {props.label}
        </span>
        <input
          type="checkbox"
          checked={props.isSelected} 
          onChange={()=>null}
          style={{
            marginLeft: "10px",
          }}
        />
      </div>
    </components.Option>
  );
};

export default CustomOption;
