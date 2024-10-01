export const GetUsers = ({ companies = [], agencies = [] }) => {
  return [
    {
      title: "User Form",
      fields: [
        {
          type: "text",
          id: "firstName",
          label: "First Name",
          required: true,
        },
        {
          type: "text",
          id: "lastName",
          label: "Last Name",
          required: true,
        },
        {
          type: "date",
          id: "hireDate",
          label: "Hire Date",
          required: true,
        },
        {
          type: "select",
          id: "gender",
          label: "Gender",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ],
          required: true,
        },
        {
          type: "checkbox",
          text: "status",
          id: "status",
          label: "Active",
          checked: true,
          required: true,
        },
        {
          type: "date",
          id: "inactiveDate",
          label: "Inactive Date",
          required: false,
        },
        {
          type: "email",
          id: "email",
          label: "Email Address",
          required: true,
        },
        {
          type: "number",
          id: "mobileNumber",
          label: "Mobile Number",
          required: true,
        },
        {
          type: "checkbox",
          text: "Whatsapp Number",

          id: "sameAsWhatsappNumber",
          label: "Same as Mobile Number",
          checked: true,
          required: true,
        },
        {
          type: "number",
          id: "whatsappNumber",
          label: "Whatsapp Number",
          required: true,
        },
        {
          type: "select",
          id: "company",
          label: "Company",
          options: [...companies],
          required: true,
        },
        {
          type: "select",
          id: "role",
          label: "Role",
          options: [
            { value: "admin", label: "Admin" },
            { value: "superAdmin", label: "Super Admin" },
            { value: "customer", label: "Customer" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "agency",
          label: "Agency",
          options: [
            ...agencies
          ],
          required: true,
        },
      ],
    },
  ];
};
