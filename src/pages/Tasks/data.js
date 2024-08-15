export const getTasks = ({ companies = [], users = [] }) => {
  console.log(companies);
  return [
    {
      type: "select",
      id: "company",
      label: "Company",
      options: [...companies],
      required: true,
    },
    {
      type: "select",
      id: "assignedTo",
      label: "Assigned To",
      options: [...users],
      defaultValue: "All",

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
    {
      type: "file",
      id: "attachment",
      label: "Attachment",
      required: true,
    },
  ];
};

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
        { value: "gstMonthlyPayment", label: "GST - Monthly Payment" },
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
  } else if (["gstMonthlyPayment"].includes(data?.taskName)) {
    fields = [...fields, ...getMonthlyPamnetData(data)];
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
        { value: "Pending for Apply", label: "Pending for Apply" },
        { value: "Applied", label: "Applied" },
      ],
      required: true,
    },
    ...(data.applicationStatus === "Applied"
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
              { value: "Pending for Approval", label: "Pending for Approval" },
              {
                value: "Pending for Clarification",
                label: "Pending for Clarification",
              },
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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date()
    .toLocaleString("default", { month: "short" })
    .toLowerCase();
  const startYear = currentYear - 5;
  const endYear = currentYear + 5;

  const yearOptions = [];
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  const fields = [
    ...(data.taskName === "gstMonthly"
      ? [
          {
            type: "select",
            id: "gstMonthly_gstType",
            label: "Type of GST Form",
            options: [
              { value: "gstr1", label: "GSTR1" },
              { value: "gstr3b", label: "GSTR3B" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.gstMonthly_gstType
      ? [
          {
            type: "select",
            id: "gstMonthly_filingStatus",
            label: "Filing Status",
            options: [
              { value: "filled", label: "Filled" },
              { value: "notFilled", label: "Not Filled" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.gstMonthly_filingStatus === "notFilled"
      ? [
          {
            type: "select",
            id: "gstMonthly_previousMonth",
            label: "Previous Month Not Filed",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
          },
        ]
      : []),
    ...(data.currentStatus === "paymentPending" && data.gstMonthly_gstType === "gstr3b"
      ? [
          {
            type: "number",
            id: "gstMonthly_taxAmount",
            label: "Tax Amount",
            placeholder: "Tax Amount",
            required: true,
          },
        ]
      : []),
    ...(data.gstMonthly_filingStatus === "filled"
      ? [
          {
            type: "date",
            id: "gstMonthly_fileDate",
            label: "File Date",
            required: true,
          },
          {
            type: "text",
            id: "gstMonthly_monthlyarn",
            label: "ARN Number",
            required: true,
          },
          {
            type: "select",
            id: "gstMonthly_monthlyMonth",
            label: "Month",
            options: [
              { value: "jan", label: "January" },
              { value: "feb", label: "February" },
              { value: "mar", label: "March" },
              { value: "apr", label: "April" },
              { value: "may", label: "May" },
              { value: "jun", label: "June" },
              { value: "jul", label: "July" },
              { value: "aug", label: "August" },
              { value: "sep", label: "September" },
              { value: "oct", label: "October" },
              { value: "nov", label: "November" },
              { value: "dec", label: "December" },
            ],
            defaultValue: currentMonth,
            required: true,
          },
          {
            type: "select",
            id: "gstMonthly_monthlyYear",
            label: "Year",
            options: yearOptions,
            defaultValue: currentYear,
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
      id: "gstInactive_typeOfInactive",
      label: "Type of Inactive",
      options: [
        { value: "suspended", label: "Suspended" },
        { value: "cancelled", label: "Cancelled" },
      ],
      required: true,
    },
    ...(data.gstInactive_typeOfInactive === "cancelled"
      ? [
          {
            type: "select",
            id: "gstInactive_cancellationStatus",
            label: "Cancellation Status",
            options: [
              { value: "voluntarily", label: "Voluntarily" },
              { value: "suoMotu", label: "Suo moto" },
            ],
            required: true,
          },
          ...(data?.gstInactive_cancellationStatus === "voluntarily"
            ? [
                {
                  type: "select",
                  id: "gstInactive_volApplicationStatus",
                  label: "Application Status",
                  options: [
                    { value: "pendingForApply", label: "Pending for Apply" },
                    { value: "applied", label: "Applied" },
                  ],
                  required: true,
                },
                ...(data?.gstInactive_volApplicationStatus === "applied"
                  ? [
                      {
                        type: "text",
                        id: "gstInactive_arn",
                        label: "ARN",
                        required: true,
                      },
                      {
                        type: "date",
                        id: "gstInactive_arnDate",
                        label: "ARN Date",
                        required: true,
                      },
                      {
                        type: "select",
                        id: "gstInactive_applicationSubStatus",
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
                      ...(data?.gstInactive_applicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "gstInactive_dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "gstInactive_finalReturnStatus",
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
          ...(data?.gstInactive_cancellationStatus === "suoMotu"
            ? [
                {
                  type: "select",
                  id: "gstInactive_needToRevoceCancellation",
                  label: "Need to Revoc Cancellation",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                  required: true,
                },
                ...(data?.gstInactive_needToRevoceCancellation === "yes"
                  ? [
                      {
                        type: "select",
                        id: "gstInactive_applicationStatus",
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
                      ...(data?.gstInactive_applicationStatus === "applied"
                        ? [
                            {
                              type: "text",
                              id: "gstInactive_arn",
                              label: "ARN",
                              required: true,
                            },
                            {
                              type: "date",
                              id: "gstInactive_arnDate",
                              label: "ARN Date",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "gstInactive_applicationSubStatus",
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
                      ...(data.gstInactive_applicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "gstInactive_dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                            {
                              type: "select",
                              id: "gstInactive_finalReturnStatus",
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
    ...(data?.gstInactive_applicationSubStatus === "rejected" &&
    ((data?.gstInactive_cancellationStatus === "suoMotu" &&
      data?.gstInactive_needToRevoceCancellation === "yes") ||
      data?.gstInactive_cancellationStatus === "voluntarily")
      ? [
          {
            type: "select",
            id: "gstInactive_goingForAppeal",
            label: "Going For Appeal",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
          },
          ...(data.gstInactive_goingForAppeal === "yes"
            ? [
                {
                  type: "select",
                  id: "gstInactive_rejectState",
                  label: "Application Status",
                  options: [
                    { value: "pendingForApply", label: "Pending for Apply" },
                    { value: "applied", label: "Applied" },
                  ],
                  required: true,
                },
                ...(data?.gstInactive_rejectState === "applied"
                  ? [
                      {
                        type: "text",
                        id: "gstInactive_appealArn",
                        label: "ARN",
                        required: true,
                      },
                      {
                        type: "date",
                        id: "gstInactive_appealArnDate",
                        label: "ARN Date",
                        required: true,
                      },
                      {
                        type: "select",
                        id: "gstInactive_appealApplicationSubStatus",
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
                      ...(data?.gstInactive_appealApplicationSubStatus === "approved"
                        ? [
                            {
                              type: "date",
                              id: "gstInactive_dateOfApproval",
                              label: "Date of Approval",
                              required: true,
                            },
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
          ...(data.gstInactive_goingForAppeal === "no"
            ? [
                {
                  type: "select",
                  id: "gstInactive_appealFileReturnStatus",
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

export const getMonthlyPamnetData = (data) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date()
    .toLocaleString("default", { month: "short" })
    .toLowerCase();

  const startYear = currentYear - 5;
  const endYear = currentYear + 5;

  const yearOptions = [];
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }
  const fields = [
    ...(data.taskName === "gstMonthlyPayment"
      ? [
          {
            type: "select",
            id: "gstMonthlyPayment_quarter",
            label: "Quarter",
            options: [
              { value: "quarter1", label: "QUARTER 1" },
              { value: "quarter2", label: "QUARTER 2" },
              { value: "quarter2", label: "QUARTER 2" },
              { value: "quarter3", label: "QUARTER 3" },
            ],
            required: true,
          },
          {
            type: "select",
            id: "gstMonthlyPayment_payment",
            label: "Payment",
            options: [
              { value: "paid", label: "Paid" },
              { value: "notPaid", label: "Not Paid" },
            ],
            required: true,
          },
          {
            type: "select",
            id: "gstMonthlyPayment_monthlyMonth",
            label: "Month",
            defaultValue: currentMonth,
            options: [
              { value: "jan", label: "January" },
              { value: "feb", label: "February" },
              { value: "mar", label: "March" },
              { value: "apr", label: "April" },
              { value: "may", label: "May" },
              { value: "jun", label: "June" },
              { value: "jul", label: "July" },
              { value: "aug", label: "August" },
              { value: "sep", label: "September" },
              { value: "oct", label: "October" },
              { value: "nov", label: "November" },
              { value: "dec", label: "December" },
            ],
            required: true,
          },
          {
            type: "select",
            id: "gstMonthlyPayment_monthlyYear",
            label: "Year",
            options: yearOptions,
            defaultValue: currentYear.toString(),
            required: true,
          },
          {
            type: "date",
            id: "gstMonthlyPayment_paymentDate",
            label: "Payment Date",
            required: true,
          },
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

const statusOptions = [
  { value: "", label: "All" },
  { value: "Pending for Apply", label: "Pending for Apply" },
  { value: "Applied", label: "Applied" },
];

const applicationSubstatusOptions = [
  { value: "", label: "All" },

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
];

export const taskSearch = [
  {
    type: "text",
    id: "company",
    label: "Company",
    required: true,
  },
  {
    type: "select",
    id: "assignedTo",
    label: "Assigned To",
    options: { value: "All", label: "All" },
    required: false,
  },
  {
    type: "select",
    id: "status",
    label: "Status",
    options: statusOptions,
    required: false,
  },
  {
    type: "select",
    id: "applicationSubStatus",
    label: "Application Substatus",
    options: applicationSubstatusOptions, // Add the options here
    required: false,
  },
];

// Add other task types in a similar manner
