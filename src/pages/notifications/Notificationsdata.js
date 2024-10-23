/* export const checkboxJson = [
  {
    id: "Company",
    label: "Company",
    items: [
      {
        id: "createCompany",
        label: "Create Company",
      },
      {
        id: "updateCompany",
        label: "Update Company",
      },
      {
        id: "deleteCompany",
        label: "Delete Company",
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      {
        id: "createUser",
        label: "Create User",
      },
      {
        id: "updateUser",
        label: "Update User",
      },
      {
        id: "deleteUser",
        label: "Delete User",
      },

      {
        id: "approval",
        label: "Approval",
      },
      {
        id: "rejection",
        label: "Rejection",
      },
      {
        id: "submission",
        label: "Submission",
      },
    ],
  },

  {
    id: "tasks",
    label: "Tasks",
    items: [
      {
        id: "createTask",
        label: "Create Task",
      },
      {
        id: "updatetask",
        label: "Update Task",
      },
      {
        id: "deletetask",
        label: "Delete Task",
      },
    ],
  },
];
 */

export const checkboxJson = [
  {
    id: "oneDayBeforeDueDate",
    label: "1 Day Before Due Date",
  },
  {
    id: "oneDayAfterDueDate",
    label: "1 Day After Due Date",
  },
  {
    id: "assignNewTask",
    label: "Assign New Task",
  },
];

const toOptions = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Superadmin" },
  { value: "employee", label: "Employee" },
];

const ccOptions = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Superadmin" },
  { value: "employee", label: "Employee" },
];
// Export formFields as a function to accept dynamic options
export const getFormFields = () => [
  {
    id: "toAddress",
    label: "To*",
    placeholder: "--Select--",
    type: "select",
    options: toOptions, // Inject toOptions here
    required: true,
  },
  {
    id: "ccAddress",
    label: "CC",
    placeholder: "--Select--",
    type: "select",
    options: ccOptions, // Inject ccOptions here
    required: false,
  },
  {
    id: "subject",
    placeholder: "--Subject Of Notification--",

    label: "Subject*",
    type: "text",
    required: true,
  },
  {
    id: "message",
    label: "Message*",
    type: "textarea",
    placeholder: "Enter What You Want to Convey",
    required: true,
  },
  // {
  //   id: "attachment",
  //   label: "Attachment",
  //   type: "attachment",
  //   required: false, // Attachment is optional
  // },
];
