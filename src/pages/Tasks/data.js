export const tasks = [
    {
      title: "Task Form",
      fields: [
        {
          type: "select",
          id: "company",
          label: "Company",
          options: [
            { value: "company1", label: "Company 1" },
            { value: "company2", label: "Company 2" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "assignedTo",
          label: "Assigned To",
          options: [
            { value: "user1", label: "User 1" },
            { value: "user2", label: "User 2" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "priority",
          label: "Priority",
          options: [
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ],
          required: true,
        },
        {
          type: "date",
          id: "startDate",
          label: "Start Date",
          required: true,
        },
        {
          type: "date",
          id: "dueDate",
          label: "Due Date",
          required: true,
        },
        {
          type: "date",
          id: "actualCompletionDate",
          label: "Actual Completion Date",
          required: false,
        },
        {
          type: "select",
          id: "taskType",
          label: "Task Type",
          options: [
            { value: "gst", label: "GST" },
            { value: "providentFund", label: "Provident Fund" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "taskName",
          label: "Task Name",
          options: [
            { value: "gstNewRegistration", label: "GST New Registration" },
            {
              value: "providentFundNewRegistration",
              label: "Provident Fund New Registration",
            },
          ],
          required: true,
        },
        {
          type: "select",
          id: "applicationStatus",
          label: "Application Status",
          options: [
            { value: "pendingForApply", label: "Pending for Apply" },
            { value: "applied", label: "Applied" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "arn",
          label: "ARN",
          options: [
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ],
          required: false,
        },
        {
          type: "date",
          id: "arnDate",
          label: "ARN Date",
          required: false,
        },
        {
          type: "select",
          id: "applicationSubStatus",
          label: "Application Sub Status",
          options: [
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ],
          required: false,
        },
        {
          type: "date",
          id: "dateOfApproval",
          label: "Date Of Approval",
          required: false,
        },
      ],
    },
  ];