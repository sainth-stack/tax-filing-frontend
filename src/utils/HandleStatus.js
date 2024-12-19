// // Utility function to handle status of sections dynamically
// export const handleStatus = (
//   id,
//   value,
//   setActiveState,
//   setFields,
//   fieldRequirements
// ) => {
//   console.log("id check at util", id);

//   // Loop through field requirements to dynamically handle the logic
//   fieldRequirements.forEach((fieldRequirement) => {
//     if (
//       id === fieldRequirement.id &&
//       value === fieldRequirement.inactiveValue
//     ) {
//       setActiveState(true); // Set to true for the section
//       setFields((prevFields) =>
//         prevFields.map((field) => {
//           if (fieldRequirement.requiredFields.includes(field.id)) {
//             return { ...field, required: true }; // Make required fields required
//           }
//           return field;
//         })
//       );
//     } else if (
//       id === fieldRequirement.id &&
//       value !== fieldRequirement.inactiveValue
//     ) {
//       setActiveState(false); // Reset active state when value does not match the condition
//       setFields((prevFields) =>
//         prevFields.map((field) => {
//           if (fieldRequirement.requiredFields.includes(field.id)) {
//             return { ...field, required: false }; // Remove required status for fields
//           }
//           return field;
//         })
//       );
//     }
//   });
// };
