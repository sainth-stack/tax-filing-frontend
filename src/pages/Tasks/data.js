export const tasks = [
  {
    type: "select",
    id: "company",
    label: "Company",
    options: [],
    required: true,
  },
  {
    type: "select",
    id: "assignedTo",
    label: "Assigned To",
    options: [],
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
      { value: "incomeTax", label: "Income Tax" },
      { value: "tds", label: "TDS and TCS" },
      { value: "esi", label: "ESI" },
      { value: "professionalTex", label: "Professional Tax" },
    ],
    required: true,
  },
];

export const getGstData = (data) => {
  const type = data?.taskType;
  console.log(data?.applicationStatus);
  const defaultField = [
    {
      type: "select",
      id: "taskName",
      label: "Task Name",
      options: [
        { value: "gstNewRegistration", label: "GST - New Registration" },
        { value: "gstInactive", label: "GST - Inactive Registration" },
        { value: "gstRefund", label: "GST - Refund" },
        { value: "gstAmendments", label: "GST - Amendments" },
        { value: "gstMonthly", label: "GST - Monthly Filing" },
      ],
      required: true,
    },
  ];

  let fields = [...defaultField];

  if (
    ["gstRefund", "gstNewRegistration", "gstAmendments"].includes(
      data?.taskName
    )
  ) {
    fields = [...fields, ...GetCommonFields(data)];
  } else if (["gstMonthly"].includes(data?.taskName)) {
    fields = [...fields, ...getGstMonthlyData(data)];
  } else if (["gstInactive"].includes(data?.taskName)) {
    fields = [...fields, ...getInactiveData(data)];
  }

  return fields;
};

const GetCommonFields = (data) => {
  const Commondfields = [
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
    ...(data.applicationStatus === "applied"
      ? [
          {
            type: "number",
            id: "arn",
            label: "ARN",
            placeholder: "ARN",
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
        ]
      : []),
    ...(data?.applicationSubStatus === "approved"
      ? [
          {
            type: "date",
            id: "dateOfApproval",
            label: "Date Of Approval",
            required: false,
          },
        ]
      : []),
  ];
  return Commondfields;
};

export const getGstMonthlyData = (data) => {
  const type = data?.taskType;
  console.log(data?.applicationStatus);
  const fields = [
    ...(data.taskName === "gstMonthly"
      ? [
          {
            type: "select",
            id: "gstType",
            label: "Type of GST Form",
            options: [
              { value: "gstr1", label: "GSTR1" },
              { value: "gstr3b", label: "GSTR3B" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.gstType
      ? [
          {
            type: "select",
            id: "filingStatus",
            label: "Filing Status",
            options: [
              { value: "filled", label: "Filled" },
              { value: "notFilled", label: "Not Filled" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.filingStatus === "notFilled"
      ? [
          {
            type: "select",
            id: "previousMonth",
            label: "Previous Month Not Filed",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
          },
          {
            type: "select",
            id: "currentStatus",
            label: "Current Status",
            options: [
              { value: "pending", label: "Documents Pending" },
              {
                value: "waitingForClarification",
                label: "Waiting For Clarification",
              },
              { value: "progress", label: "Work In Progress" },
              { value: "paymentPending", label: "Tax Payment Pending" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.currentStatus === "paymentPending" && data.gstType === "gstr3b"
      ? [
          {
            type: "number",
            id: "taxAmount",
            label: "Tax Amount",
            placeholder: "Tax Amount",
            required: true,
          },
        ]
      : []),
    ...(data.filingStatus === "filled"
      ? [
          {
            type: "date",
            id: "fileDate",
            label: "File Date",
            required: true,
          },
        ]
      : []),
  ];
  return fields;
};

export const getInactiveData = (data) => {
  const fields = [
    {
      type: "select",
      id: "typeOfInactive",
      label: "Type of Inactive",
      options: [
        { value: "suspended", label: "Suspended" },
        { value: "cancelled", label: "Cancelled" },
      ],
      required: true,
    },
    ...(data.typeOfInactive === "cancelled"
      ? [
          {
            type: "select",
            id: "cancellationStatus",
            label: "Cancellation Status",
            options: [
              { value: "voluntarily", label: "Voluntarily" },
              { value: "suoMotu", label: "Suo moto" },
            ],
            required: true,
          },
          ...(data?.cancellationStatus === "voluntarily"
            ? [
                {
                  type: "select",
                  id: "volApplicationStatus",
                  label: "Application Status",
                  options: [
                    { value: "pendingForApply", label: "Pending for Apply" },
                    { value: "applied", label: "Applied" },
                  ],
                  required: true,
                },
                ...(data?.volApplicationStatus === "applied"
                  ? [
                      {
                        type: "text",
                        id: "arn",
                        label: "ARN",
                        required: true,
                      },
                      {
                        type: "date",
                        id: "arnDate",
                        label: "ARN Date",
                        required: true,
                      },
                      {
                        type: "select",
                        id: "applicationSubStatus",
                        label: "Application Sub Status",
                        options: [
                          {
                            value: "pendingForApproval",
                            label: "Pending for Approval",
                          },
                          {
                            value: "pendingForClarification",
                            label: "Pending for Clarification",
                          },
                          { value: "rejected", label: "Rejected" },
                          { value: "approved", label: "Approved" },
                        ],
                        required: true,
                      },
                      ...(data?.applicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "finalReturnStatus",
                              label: "Final Return Status",
                              options: [
                                { value: "filed", label: "Filed" },
                                { value: "notFiled", label: "Not Filed" },
                              ],
                              required: true,
                            },
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
          ...(data?.cancellationStatus === "suoMotu"
            ? [
                {
                  type: "select",
                  id: "needToRevoceCancellation",
                  label: "Need to Revoc Cancellation",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                  required: true,
                },
                ...(data?.needToRevoceCancellation === "yes"
                  ? [
                      {
                        type: "select",
                        id: "applicationStatus",
                        label: "Application Status",
                        options: [
                          {
                            value: "pendingForApply",
                            label: "Pending for Apply",
                          },
                          { value: "applied", label: "Applied" },
                        ],
                        required: true,
                      },
                      ...(data?.applicationStatus === "applied"
                        ? [
                            {
                              type: "text",
                              id: "arn",
                              label: "ARN",
                              required: true,
                            },
                            {
                              type: "date",
                              id: "arnDate",
                              label: "ARN Date",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "applicationSubStatus",
                              label: "Application Sub Status",
                              options: [
                                {
                                  value: "pendingForApproval",
                                  label: "Pending for Approval",
                                },
                                {
                                  value: "pendingForClarification",
                                  label: "Pending for Clarification",
                                },
                                { value: "rejected", label: "Rejected" },
                                { value: "approved", label: "Approved" },
                              ],
                              required: true,
                            },
                          ]
                        : []),
                      ...(data.applicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "finalReturnStatus",
                              label: "Final Return Status",
                              options: [
                                { value: "filed", label: "Filed" },
                                { value: "notFiled", label: "Not Filed" },
                              ],
                              required: true,
                            },
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
        ]
      : []),
    ...(data?.applicationSubStatus === "rejected" &&
    ((data?.cancellationStatus === "suoMotu" &&
      data?.needToRevoceCancellation === "yes") ||
      data?.cancellationStatus === "voluntarily")
      ? [
          {
            type: "select",
            id: "goingForAppeal",
            label: "Going For Appeal",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
          },
          ...(data.goingForAppeal === "yes"
            ? [
                {
                  type: "select",
                  id: "rejectState",
                  label: "Application Status",
                  options: [
                    { value: "pendingForApply", label: "Pending for Apply" },
                    { value: "applied", label: "Applied" },
                  ],
                  required: true,
                },
                ...(data?.rejectState === "applied"
                  ? [
                      {
                        type: "text",
                        id: "appealArn",
                        label: "ARN",
                        required: true,
                      },
                      {
                        type: "date",
                        id: "appealArnDate",
                        label: "ARN Date",
                        required: true,
                      },
                      {
                        type: "select",
                        id: "appealApplicationSubStatus",
                        label: "Application Sub Status",
                        options: [
                          {
                            value: "pendingForApproval",
                            label: "Pending for Approval",
                          },
                          {
                            value: "pendingForClarification",
                            label: "Pending for Clarification",
                          },
                          { value: "rejected", label: "Rejected" },
                          { value: "approved", label: "Approved" },
                        ],
                        required: true,
                      },
                      ...(data?.appealApplicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
          ...(data.goingForAppeal === "no"
            ? [
                {
                  type: "select",
                  id: "appealFileReturnStatus",
                  label: "Final Return Status",
                  options: [
                    { value: "filed", label: "Filed" },
                    { value: "notFiled", label: "Not Filed" },
                  ],
                  required: true,
                },
              ]
            : []),
        ]
      : []),
  ];
  return fields;
};

export const providentFund = {
  default: [
    {
      type: "select",
      id: "taskName",
      label: "Task Name",
      options: [
        { value: "pfRegistration", label: "PF - Registration" },
        { value: "pfMonthly", label: "PF - Monthly Filing" },
        { value: "pfAnnual", label: "PF - Annual Return" },
      ],
      required: true,
    },
  ],
  pfRegistration: [
    {
      type: "select",
      id: "applicationStatus",
      label: "Application Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "submitted", label: "Submitted" },
      ],
      required: true,
    },
    {
      type: "date",
      id: "submissionDate",
      label: "Submission Date",
      required: false,
    },
    {
      type: "text",
      id: "registrationNumber",
      label: "Registration Number",
      required: false,
    },
  ],
  pfMonthly: [
    {
      type: "date",
      id: "filingDate",
      label: "Filing Date",
      required: true,
    },
    {
      type: "number",
      id: "totalEmployees",
      label: "Total Employees",
      required: true,
    },
    {
      type: "number",
      id: "totalAmount",
      label: "Total Amount",
      required: true,
    },
  ],
  pfAnnual: [
    {
      type: "date",
      id: "filingDate",
      label: "Filing Date",
      required: true,
    },
    {
      type: "number",
      id: "totalEmployees",
      label: "Total Employees",
      required: true,
    },
    {
      type: "number",
      id: "totalAmount",
      label: "Total Amount",
      required: true,
    },
    {
      type: "text",
      id: "annualReturnNumber",
      label: "Annual Return Number",
      required: false,
    },
  ],
};

// Add other task types in a similar manner
