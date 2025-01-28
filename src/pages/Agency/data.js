export const sectionsData = (data) => {
  return [
    {
      title: "Agency Details",
      fields: [
        {
          type: "text",
          id: "AgencyDetails.agencyName", // Changed to camelCase
          label: "Agency Name",
          required: true,
          placeholder: "Enter Agency Name",
        },
        {
          type: "text",
          id: "AgencyDetails.agencyLocation", // Changed to camelCase
          label: "Agency Location",
          required: true,
          placeholder: "Enter Agency Location",
        },
        {
          type: "text",
          id: "AgencyDetails.firstName", // Changed to camelCase
          label: "First Name",
          placeholder: "Enter First Name",
        },
        {
          type: "text",
          id: "AgencyDetails.lastName", // Changed to camelCase
          label: "Last Name",
          placeholder: "Enter Last Name",
        },
        {
          type: "text",
          id: "AgencyDetails.email", // Changed to camelCase
          label: "email",
          placeholder: "Enter email",
        },
        {
          type: "text",
          id: "AgencyDetails.password", // Changed to camelCase
          label: "Password",
          placeholder: "Enter Password",
        },
        {
          type: "date",
          id: "AgencyDetails.effectiveFrom", // Changed to camelCase
          label: " Start Date",
          required: true,
        },
        {
          type: "date",
          id: "AgencyDetails.effectiveTo", // Changed to camelCase
          label: " End Date",
          required: true,
        },
      ],
    },
  ];
};
