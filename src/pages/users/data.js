

// Update GetUsers function
export const GetUsers = (companiesdata = [], agnciesdata = []) => {
  return [
    {
      title: "User Form",
      fields: [
        {
          type: "text",
          id: "firstName",
          label: "First Name",
        },
        {
          type: "text",
          id: "lastName",
          label: "Last Name",
        },

        {
          type: "date",
          id: "hireDate",
          label: "Hire Date",
        },
        {
          type: "select",
          id: "gender",
          label: "Gender",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ],
        },
        {
          type: "checkbox",
          text: "status",
          id: "status",
          label: "Active",
          checked: true,
        },
        {
          type: "date",
          id: "inactiveDate",
          label: "Inactive Date",
        },
        {
          type: "email",
          id: "email",
          label: "Email Address",
        },
        {
          type: "password",
          id: "password",
          label: "Password",
        },
        {
          type: "number",
          id: "mobileNumber",
          label: "Mobile Number",
        },
        {
          type: "checkbox",
          text: "Whatsapp Number",
          id: "sameAsWhatsappNumber",
          label: "Same as Mobile Number",
          checked: true,
        },
        {
          type: "number",
          id: "whatsappNumber",
          label: "Whatsapp Number",
        },
        {
          type: "select",
          id: "company",
          label: "Company",
          options: companiesdata, // Use dynamic companies data
          multiple: true,
        },
        {
          type: "select",
          id: "role",
          label: "Role",
          options: [
            { value: "A", label: "Admin" },
            // { value: "S", label: "Super Admin" },
            //{ value: "C", label: "Customer" },
            { value: "U", label: "Basic" },

          ],
        },
        {
          type: "select",
          id: "agency",
          label: "Agency",
          options: agnciesdata, // Use dynamic agencies data
        },
      ],
    },
  ];
};
