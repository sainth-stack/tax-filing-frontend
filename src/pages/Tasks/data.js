export const getTasks = ({ companies = [], users = [] }) => {
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
      // defaultValue: "All",

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
        { value: "professionalTax", label: "Professional Tax" },
      ],
      required: true,
    },
  ];
};

export const getEndTasks = () => {
  return [
    {
      type: "file",
      id: "attachment",
      label: "Attachment",
      required: true,
    },
    {
      type: "textarea",
      id: "remarks", // Updated with common prefix 'tax_'
      label: "Remarks",
      required: true,
    },
  ];
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
    ...(
      data?.applicationSubStatus === "approved"
        ? [
          {
            type: "date",
            id: "dateOfApproval",
            label: "Date Of Approval",
            required: false,
          },
          ...(data?.taskName === "gstNewRegistration"
            ? [
              {
                type: "file",
                id: "approvalCertificate",
                label: "Approval Certificate",
                required: true,
              },
            ]
            : []),
        ]
        : []
    ),

  ];
  return Commondfields;
};

export const getGstData = (data, companies) => {
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
    fields = [...fields, ...getMonthlyPamnetData(data, companies)];
  }

  return fields;
};

const GetMonthlyCommonFields = (custom) => {
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
    {
      type: "text",
      id: "gstMonthly_monthlyarn",
      label: custom ? custom : "ARN Number",
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
  ];

  return fields;
};

const getMonthYear = () => {
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
  return fields;
}

export const getGstMonthlyData = (data) => {
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
            { value: "filed", label: "filed" },
            { value: "notfiled", label: "Not filed" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data.gstMonthly_filingStatus === "notfiled"
      ? [
        {
          type: "select",
          id: "gstMonthly_previousMonth",
          label: "Previous Month Not filed",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data.currentStatus === "paymentPending" &&
      data.gstMonthly_gstType === "gstr3b"
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
    ...(data.gstMonthly_filingStatus === "filed"
      ? [
        {
          type: "date",
          id: "gstMonthly_filedate",
          label: "File Date",
          required: true,
        },
        //monthly common
        ...GetMonthlyCommonFields(),
        ...GetAttachmentFields(data)
        
      ]
      : []),
  ];

  return fields;
};

const getLabel = (test) => {
  const data = [
    { label: 'ECR Statement', key: "pfMonthly" },
    { label: 'Contribution Statement', key: "esiRegularMonthlyActivity" },
    { label: 'GSTR3B Acknowledgement', key: "gstr3b" },
    { label: 'GSTR4 Acknowledgement', key: "GST Composition" },
  ]
  const data3 = data.filter((item) => item.key === (test.taskName || test?.gstMonthly_gstType || test?.pft_taskName))
  return data3?.length > 0 ? data3[0].label : "Acknowledgement"
}

const GetAttachmentFields = (data) => {

  const fields = [];

  if (((data?.gstMonthly_filingStatus === "filed" || data.pfMonthly_filingStatus === "filed" || data.esi_filingStatus === "filed" || data.pft_filingStatus === "filed") && (data?.gstMonthly_gstType === "gstr3b" || data?.gstMonthly_gstType === "gstr1" || data?.pft_taskName === "professionalTaxRegularMonthlyActivity" || ["esiRegularMonthlyActivity", "pfMonthly"].includes(data.taskName)))) {
    fields.push({
      type: "file",
      id: "acknowledgement",
      label: getLabel(data),
      required: true,
    });

    if (((data?.gstMonthly_filingStatus === "filed" || data.pfMonthly_filingStatus === "filed" || data.esi_filingStatus === "filed" || data.pft_filingStatus === "filed") && (data?.gstMonthly_gstType === "gstr3b" || data?.pft_taskName === "professionalTaxRegularMonthlyActivity" || ["esiRegularMonthlyActivity", "pfMonthly"].includes(data.taskName)))) {
      fields.push({
        type: "file",
        id: "challan",
        label: "Challan",
        required: true,
      });
    }
  }

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
                        { value: "filed", label: "filed" },
                        { value: "notfiled", label: "Not filed" },
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
                        { value: "filed", label: "filed" },
                        { value: "notfiled", label: "Not filed" },
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
                ...(data?.gstInactive_appealApplicationSubStatus ===
                  "approved"
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
                { value: "filed", label: "filed" },
                { value: "notfiled", label: "Not filed" },
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

export const getMonthlyPamnetData = (data, companies) => {

  const company = companies.filter((item) => item.value === data.company)[0]
  const name = company?.gst?.typeOfGstFiling
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
  const quarterEndMonths = ["mar", "jun", "sep", "dec"];
  const isQuarterEnd = quarterEndMonths.includes(data.gstMonthlyPayment_monthlyMonth);
console.log(name)
  if (name === "QRMP") {
    if (data.gstMonthlyPayment_payment === "paid" && !isQuarterEnd) {
      fields.push({
        type: "file",
        id: "challan",
        label: "Challan",
        required: true,
      });
    } else if (isQuarterEnd) {
      fields.push({
        type: "file",
        id: "GSTR3B Acknowledgement",
        label: "GSTR3B Acknowledgement",
        required: true,
      });
      fields.push({
        type: "file",
        id: "challan",
        label: "Challan",
        required: true,
      });
    }
  } else if (name === "composition") {
    if (data.gstMonthlyPayment_payment === "paid") {
      fields.push({
        type: "file",
        id: "GSTR4Acknowledgement",
        label: "GSTR4 Acknowledgement",
        required: true,
      });
      fields.push({
        type: "file",
        id: "challan",
        label: "Challan",
        required: true,
      });
    }
  }

  return fields;
};

export const providentFund = (data) => {
  const defaultPfData = [
    {
      type: "select",
      id: "taskName",
      label: "Task Name",
      options: [
        { value: "pfRegistration", label: "PF - New Registration" },
        { value: "pfMonthly", label: "PF - Regular Monthly Filing" },
        { value: "pfInactive", label: "PF - Inactive Registration" },
      ],
      required: true,
    },
  ];

  let fields = [...defaultPfData];

  if (["pfRegistration", "pfInactive"].includes(data?.taskName)) {
    fields = [...fields, ...pfRegistration(data)];
  } else if (["pfMonthly"].includes(data?.taskName)) {
    fields = [...fields, ...pfMonthly(data)];
  }

  return fields;
};

export const pfRegistration = (data) => {
  const fields = [
    {
      type: "select",
      id: "pfRegistration_applicationStatus",
      label: "Application Status",
      options: [
        { value: "pending", label: "Pending for Apply" },
        { value: "applied", label: "Applied" },
      ],
      required: true,
    },
    ...(data?.pfRegistration_applicationStatus === "applied"
      ? [
        {
          type: "text",
          id: "pfRegistration_applicationNumber",
          label: "Application Number",
          required: false,
        },
        {
          type: "date",
          id: "pfRegistration_applicationDate",
          label: "Application Date",
          required: false,
        },
        {
          type: "select",
          id: "pfRegistration_ApplicationSubStatus",
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
    ...(data?.pfRegistration_ApplicationSubStatus === "approved"
      ? [
        {
          type: "date",
          id: "pfRegistration_approval",
          label: "Date of Approval",
          required: false,
        },
      ]
      : []),
  ];
  return fields;
};

export const pfMonthly = (data) => {
  const fields = [
    {
      type: "select",
      id: "pfMonthly_filingStatus",
      label: "Filing Status",
      options: [
        { value: "filed", label: "filed" },
        { value: "notfiled", label: "Not filed" },
      ],
      required: true,
    },

    ...(data?.pfMonthly_filingStatus === "filed"
      ? [
        {
          type: "date",
          id: "pfMonthly_filedate",
          label: "File Date",
          required: false,
        },
        ...GetMonthlyCommonFields("TRRN"),
        ...GetAttachmentFields(data)
      ]
      : []),
    ...(data?.pfMonthly_filingStatus === "notfiled"
      ? [
        {
          type: "text",
          id: "pfMonthly_prevNotfiled",
          label: "Previous Month Not filed",
          required: false,
        },
        {
          type: "select",
          id: "pfMonthly_currentStatus",
          label: "Current Status",
          options: [
            {
              value: "pendingDocuments",
              label: "Documents Pending",
            },
            {
              value: "waitingForClarification",
              label: "Waiting For Clarification",
            },
            { value: "workInProgress", label: "Work In Progress" },
          ],
          required: true,
        },
      ]
      : []),
  ];

  return fields;
};

/* for TDS and TCS */

export const TDSTCS = (data) => {
  const defaultTdsTcsData = [
    {
      type: "select",
      id: "taskName",
      label: "Task Name",
      options: [
        { value: "tdsTcs", label: "TDS/TCS" },
        { value: "tdsTcsMonthly", label: "TDS/TCS - Monthly Payment" },
      ],
      required: true,
    },
  ];

  let fields = [...defaultTdsTcsData];

  if (["tdsTcs"].includes(data?.taskName)) {
    fields = [...fields, ...tdsTcsForm(data)];
  } else if (["tdsTcsMonthly"].includes(data?.taskName)) {
    fields = [...fields, ...TdsMonthly(data)];
  }

  return fields;
};

export const tdsTcsForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "tdstcs_taskName",
      label: "TDS TCS Task Name",
      options: [
        { value: "TDS-24Q", label: "TDS-24Q" },
        { value: "TDS-26Q", label: "TDS-26Q" },
        { value: "TDS-27Q", label: "TDS-27Q" },
        { value: "TCS-27EQ", label: "TCS-27EQ" },
      ],

      required: true,
    },
    {
      type: "select",
      id: "tdstcs_quarter",
      label: "Quarter",
      options: [
        { value: "quarter1", label: "Quarter 1" },
        { value: "quarter2", label: "Quarter 2" },
        { value: "quarter3", label: "Quarter 3" },
        { value: "quarter4", label: "Quarter 4" },
      ],
      required: true,
    },
    ...(data?.tdstcs_quarter
      ? [
        {
          type: "select",
          id: "tdstcs_filingStatus",
          label: "Filing Status",
          options: [
            { value: "filed", label: "filed" },
            { value: "notfiled", label: "Not filed" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data?.tdstcs_filingStatus === "filed"
      ? [
        {
          type: "select",
          id: "tdstcs_processingStatus",
          label: "Processing Status",
          options: [
            { value: "processed", label: "Processed" },
            { value: "processedWithError", label: "Processed with Error" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data?.tdstcs_processingStatus === "processed"
      ? [
        {
          type: "select",
          id: "tdstcs_form16Generated",
          label: "Form 16 Generated",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          required: true,
        },
      ]
      : []),
  ];

  return fields;
};

export const TdsMonthly = (data) => {
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
    {
      type: "select",
      id: "tdsmonthly_taskName",
      label: "Task Type",
      options: [
        { value: "TDS-24Q", label: "TDS-24Q" },
        { value: "TDS-26Q", label: "TDS-26Q" },
        { value: "TDS-27Q", label: "TDS-27Q" },
        { value: "TCS-27EQ", label: "TCS-27EQ" },
      ],
      required: true,
    },
    {
      type: "select",
      id: "tdsmonthly_quarter",
      label: "Quarter",
      options: [
        { value: "quarter1", label: "Quarter 1" },
        { value: "quarter2", label: "Quarter 2" },
        { value: "quarter3", label: "Quarter 3" },
        { value: "quarter4", label: "Quarter 4" },
      ],
      required: true,
    },
    {
      type: "select",
      id: "tdsmonthly_paymentStatus",
      label: "Payment Status",
      options: [
        { value: "paid", label: "Paid" },
        { value: "notPaid", label: "Not Paid" },
      ],
      required: true,
    },
    ...(data.tdsmonthly_paymentStatus === "paid"
      ? [
        {
          type: "select",
          id: "tdsmonthly_paymentMonth",
          label: "Payment Month",
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
          defaultValue: currentMonth, // Dynamic list of months with the current month as default
          required: true,
        },
        {
          type: "select",
          id: "tdsmonthly_year",
          label: "Year",
          options: yearOptions,
          defaultValue: currentYear,
          required: true,
        },
        {
          type: "date",
          id: "tdsmonthly_paidDate",
          label: "Paid Date",
        },
      ]
      : []),
  ];

  return fields;
};
// Add other task types in a similar manner

// start income tax

export const getIncomeTaxData = (data) => {
  const defaultsData = [
    {
      type: "select",
      id: "taskName", // Added common prefix 'tax_' for unique ids
      label: "Task Name",
      options: [
        { value: "incomeTaxAuditCases", label: "Income Tax - Audit Cases" },
        {
          value: "incomeTaxNonAuditCases",
          label: "Income Tax - Non Audit Cases",
        },
        { value: "incomeTaxAdvanceTax", label: "Income Tax - Advance Tax" },
      ],
      required: true,
    },
  ];

  let fields = [...defaultsData];

  if (["incomeTaxAuditCases"].includes(data?.taskName)) {
    fields = [...fields, ...incomeTaxAuditForm(data)];
  } else if (["incomeTaxNonAuditCases"].includes(data?.taskName)) {
    fields = [...fields, ...incomeTaxNonAuditForm(data)];
  } else if (["incomeTaxAdvanceTax"].includes(data?.taskName)) {
    fields = [...fields, ...incomeTaxAdvanceTaxForm(data)];
  }

  return fields;
};

export const incomeTaxAuditForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "tax_formStatus", // Updated with common prefix 'tax_'
      label: "3CB and 3CD Filing Status",
      options: [
        { value: "filed", label: "Filed" },
        { value: "notFiled", label: "Not Filed" },
      ],
      required: true,
    },
    ...(data?.tax_formStatus === "filed"
      ? [
        {
          type: "select",
          id: "tax_filingStatus", // Updated with common prefix 'tax_'
          label: "Income Tax Filing Status",
          options: [
            { value: "filledWith", label: "Filed with e-Verificaton" },
            { value: "filedwithout", label: "Filed without e-Verification" },
            { value: "notFiled", label: "Not Filed" },
          ],
          required: true,
        },
      ]
      : []),
    ...((data?.tax_filingStatus === "filledWith" || data?.tax_filingStatus === "filedwithout")
      ? [
        {
          type: "select",
          id: "tax_paymentStatus", // Updated with common prefix 'tax_'
          label: "Tax Payment Status",
          options: [
            { value: "taxPaid", label: "Tax Paid" },
            { value: "taxNotPaid", label: "Tax Not Paid" },
            { value: "partiallyPaid", label: "Partially Paid" },
            // { value: "verified", label: "Verified" },
          ],
          required: true,
        }
      ]
      : []),
    ...(["taxPaid", "partiallyPaid", "verified"].includes(
      data?.tax_paymentStatus
    )
      ? [
        {
          type: "number",
          id: "tax_paymentAmount", // Updated with common prefix 'tax_'
          label: "Tax Payment Amount",
          required: true,
        },
        {
          type: "date",
          id: "tax_paymentDate", // Updated with common prefix 'tax_'
          label: "Tax Payment Date",
          required: true,
          placeholder: "DD-Mon-YYYY",
        },
        {
          type: "date",
          id: "tax_filingDate", // Updated with common prefix 'tax_'
          label: "Tax Filing Date",
          required: true,
          placeholder: "DD-Mon-YYYY",
        },
      ]
      : []),
  ];

  return fields;
};

export const incomeTaxNonAuditForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "tax_filingStatus", // Updated with common prefix 'tax_'
      label: "Income Tax Filing Status",
      options: [
        { value: "filedwith", label: "Filed with e-Verificaton" },
        { value: "filedwithout", label: "Filed without e-Verification" },
        { value: "notFiled", label: "Not Filed" },
      ],
      required: true,
    },
    ...((data?.tax_filingStatus === "filedwith" || data?.tax_filingStatus === "filedwithout")
      ? [
        {
          type: "date",
          id: "tax_verification_date", // Updated with common prefix 'tax_'
          label: "Verification Date",
          required: true,
        },
        {
          type: "date",
          id: "tax_filing_e_Date", // Updated with common prefix 'tax_'
          label: "Filed Date",
          required: true,
        },
      ]
      : []),
    ...((data?.tax_filingStatus === "filedwith" || data?.tax_filingStatus === "filedwithout")
      ? [
        {
          type: "select",
          id: "tax_paymentStatus", // Updated with common prefix 'tax_'
          label: "Tax Payment Status",
          options: [
            { value: "taxPaid", label: "Tax Paid" },
            { value: "taxNotPaid", label: "Tax Not Paid" },
            { value: "partiallyPaid", label: "Partially Paid" },
            // { value: "verified", label: "Verified" },
            // { value: "notVerified", label: "Not Verified" },
          ],
          required: true,
        },
      ]
      : []),
    ...(["taxPaid", "partiallyPaid", "verified"].includes(
      data?.tax_paymentStatus
    )
      ? [
        {
          type: "number",
          id: "tax_paymentAmount", // Updated with common prefix 'tax_'
          label: "Tax Payment Amount",
          required: true,
        },
        {
          type: "date",
          id: "tax_paymentDate", // Updated with common prefix 'tax_'
          label: "Tax Payment Date",
          required: true,
        },
        {
          type: "date",
          id: "tax_verifiedDate", // Updated with common prefix 'tax_'
          label: "Verified Date",
          required: false,
        },
        {
          type: "date",
          id: "tax_filingDate", // Updated with common prefix 'tax_'
          label: "Filed Date",
          required: true,
        },
      ]
      : []),
  ];
  return fields;
};

export const incomeTaxAdvanceTaxForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "tax_quarter", // Updated with common prefix 'tax_'
      label: "Quarter",
      options: [
        { value: "quarter1", label: "Quarter 1" },
        { value: "quarter2", label: "Quarter 2" },
        { value: "quarter3", label: "Quarter 3" },
        { value: "quarter4", label: "Quarter 4" },
      ],
      required: true,
    },
    ...(data?.tax_quarter === "quarter1"
      ? [
        {
          type: "select",
          id: "tax_paymentStatus", // Updated with common prefix 'tax_'
          label: "Tax Payment Status",
          options: [
            { value: "taxPaid", label: "Tax Paid" },
            { value: "taxNotPaid", label: "Tax Not Paid" },
            { value: "partiallyPaid", label: "Partially Paid" },
            // { value: "verified", label: "Verified" },
          ],
          required: true,
        },
      ]
      : []),
    ...(["taxPaid", "partiallyPaid", "verified"].includes(
      data?.tax_paymentStatus
    )
      ? [
        {
          type: "number",
          id: "tax_paymentAmount", // Updated with common prefix 'tax_'
          label: "Tax Payment Amount",
          required: true,
        },
        {
          type: "date",
          id: "tax_paymentDate", // Updated with common prefix 'tax_'
          label: "Tax Payment Date",
          required: true,
        },
      ]
      : []),
    // ...(["taxPaid", "partiallyPaid", "verified"].includes(
    //   data?.tax_paymentStatus
    // )
    //   ? [
    //     {
    //       type: "select",
    //       id: "tax_filingStatus", // Updated with common prefix 'tax_'
    //       label: "Tax Filing Status",
    //       options: [
    //         { value: "filed", label: "Filed" },
    //         { value: "notFiled", label: "Not Filed" },
    //       ],
    //       required: true,
    //     },
    //   ]
    //   : []),
  ];

  return fields;
};

//start ESI
export const getEsiData = (data) => {
  const defaultsData = [
    {
      type: "select",
      id: "taskName",
      label: "Task Name",
      options: [
        { value: "esiNewRegistration", label: "ESI - New Registration" },
        {
          value: "esiRegularMonthlyActivity",
          label: "ESI Monthly",
        },
        { value: "esiInactive", label: "ESI InActive Registration" },
      ],
      required: true,
    },
  ];

  let fields = [...defaultsData];

  if (["esiNewRegistration"].includes(data?.taskName)) {
    fields = [...fields, ...esiNewRegistrationForm(data)];
  } else if (["esiRegularMonthlyActivity"].includes(data?.taskName)) {
    fields = [...fields, ...esiRegularMonthlyActivityForm(data)];
  } else if (["esiInactive"].includes(data?.taskName)) {
    fields = [...fields, ...esiInactiveForm(data)];
  }

  return fields;
};

export const esiNewRegistrationForm = (data) => {
  // Base fields
  const fields = [
    {
      type: "select",
      id: "esi_new_applicationStatus",
      label: "Application Status",
      options: [
        { value: "pendingForApply", label: "Pending for Apply" },
        { value: "applied", label: "Applied" },
      ],
      required: true,
    },

    // Conditionally add fields based on Application Status
    ...(data?.esi_new_applicationStatus === "applied"
      ? [
        {
          type: "text",
          id: "esi_new_applicationNumber",
          label: "CRN",
          placeholder: "CRN",
          required: true,
        },
        {
          type: "date",
          id: "esi_new_applicationDate",
          label: "Application Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        {
          type: "select",
          id: "esi_new_applicationSubStatus",
          label: "Application Sub Status",
          options: [
            { value: "pendingForApproval", label: "Pending for Approval" },
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
    ...(data?.esi_new_applicationSubStatus === "approved" ? [
      {
        type: "date",
        id: "esi_new_dateOfApproval",
        label: "Date of Approval",
        placeholder: "DD-Mon-YYYY",
        required: true,
      },
    ]
      : []),
  ];
  return fields;
};

export const esiRegularMonthlyActivityForm = (data) => {
  // Base fields
  const fields = [


    // Conditionally add fields based on Type of GST Form

    {
      type: "select",
      id: "esi_filingStatus",
      label: "Filing Status",
      options: [
        { value: "filed", label: "Filed" },
        { value: "notFiled", label: "Not Filed" },
      ],
      required: true,
    },


    // Conditionally add fields based on Filing Status
    ...(data?.esi_filingStatus === "notFiled"
      ? [
        {
          type: "select",
          id: "esi_previousMonthNotFiled",
          label: "Previous Month Not Filed",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          required: true,
        },
        {
          type: "select",
          id: "esi_currentStatus",
          label: "Current Status",
          options: [
            { value: "documentsPending", label: "Documents Pending" },
            {
              value: "waitingForClarification",
              label: "Waiting For Clarification",
            },
            { value: "workInProgress", label: "Work In Progress" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data?.esi_filingStatus === "filed"
      ? [
        {
          type: "date",
          id: "esi_fileDate",
          label: "File Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        ...GetMonthlyCommonFields("CRN"),
        ...GetAttachmentFields(data)
      ]
      : []),
  ];

  return fields;
};

export const esiInactiveForm = (data) => {
  // Base fields
  const fields = [
    {
      type: "select",
      id: "esi_inactive_applicationStatus",
      label: "Application Status",
      options: [
        { value: "closureApplied", label: "Closure Applied" },
        {
          value: "inactiveDueToNonFiling",
          label: "Inactive Due to Non Filing",
        },
      ],
      required: true,
    },

    // Conditionally add fields based on Application Status
    ...(data?.esi_inactive_applicationStatus === "closureApplied"
      ? [
        {
          type: "text",
          id: "esi_inactive_applicationNumber",
          label: "CRN",
          placeholder: "CRN",
          required: true,
        },
        {
          type: "date",
          id: "esi_inactive_applicationDate",
          label: "Application Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        {
          type: "select",
          id: "esi_inactive_applicationSubStatus",
          label: "Application Sub Status",
          options: [
            { value: "pendingForApproval", label: "Pending for Approval" },
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

    // Conditionally add Date of Approval based on Application Sub Status
    ...(data?.esi_inactive_applicationSubStatus === "approved"
      ? [
        {
          type: "date",
          id: "esi_inactive_dateOfApproval",
          label: "Date of Approval",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
      ]
      : []),
  ];

  return fields;
};

//start professional tax

export const getProfessionalTaxData = (data) => {
  const defaultsData = [
    {
      type: "select",
      id: "pft_taskName",
      label: "Task Name",
      options: [
        {
          value: "professionalTaxNewRegistration",
          label: "Professional Tax - New Registration",
        },
        {
          value: "professionalTaxRegularMonthlyActivity",
          label: "Professional Tax - Regular Monthly Activity",
        },
        {
          value: "professionalTaxInactive",
          label: "Professional Tax - Inactive",
        },
      ],
      required: true,
    },
  ];

  let fields = [...defaultsData];

  if (data?.pft_taskName === "professionalTaxNewRegistration") {
    fields = [...fields, ...professionalTaxNewRegistrationForm(data)];
  } else if (data?.pft_taskName === "professionalTaxRegularMonthlyActivity") {
    fields = [...fields, ...professionalTaxRegularMonthlyActivityForm(data)];
  } else if (data?.pft_taskName === "professionalTaxInactive") {
    fields = [...fields, ...professionalTaxInactiveForm(data)];
  }

  return fields;
};

export const professionalTaxNewRegistrationForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "pft_applicationStatus",
      label: "Application Status",
      options: [
        { value: "pendingForApply", label: "Pending for Apply" },
        { value: "applied", label: "Applied" },
      ],
      required: true,
    },
    ...(data?.pft_applicationStatus === "applied"
      ? [
        {
          type: "text",
          id: "pft_applicationNumber",
          label: "ARN Number",
          placeholder: "Enter ARN Number",
          required: true,
        },
        {
          type: "date",
          id: "pft_applicationDate",
          label: "Application Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        {
          type: "select",
          id: "pft_applicationSubStatus",
          label: "Application Sub Status",
          options: [
            { value: "pendingForApproval", label: "Pending for Approval" },
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
    ...(data?.pft_applicationSubStatus === "approved"
      ? [
        {
          type: "date",
          id: "pft_new_dateOfApproval",
          label: "Date of Approval",
          placeholder: "DD-Mon-YYYY",
        },
      ]
      : []),
  ];

  return fields;
};

export const professionalTaxRegularMonthlyActivityForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "pft_filingStatus",
      label: "Filing Status",
      options: [
        { value: "filed", label: "Filed" },
        { value: "notFiled", label: "Not Filed" },
      ],
      required: true,
    },
    ...(data?.pft_filingStatus === "notFiled"
      ? [
        {
          type: "select",
          id: "pft_currentStatus",
          label: "Current Status",
          options: [
            { value: "documentsPending", label: "Documents Pending" },
            {
              value: "waitingForClarification",
              label: "Waiting For Clarification",
            },
            { value: "workInProgress", label: "Work In Progress" },
          ],
          required: true,
        },
      ]
      : []),
    ...(data?.pft_filingStatus === "filed"
      ? [
        {
          type: "date",
          id: "pft_fileDate",
          label: "File Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        ...GetAttachmentFields(data)
      ]
      : []),
  ];

  return fields;
};

export const professionalTaxInactiveForm = (data) => {
  const fields = [
    {
      type: "select",
      id: "pft_applicationStatus",
      label: "Application  Status",
      options: [
        /*  { value: "pendingForApproval", label: "Pending for Approval" },
        {
          value: "pendingForClarification",
          label: "Pending for Clarification",
        }, */
        { value: "Pending for Apply", label: "Pending for Apply" },
        { value: "applied", label: "Applied" },
      ],
      required: true,
    },
    ...(data?.pft_applicationStatus === "applied"
      ? [
        {
          type: "text",
          id: "pft_applicationNumber",
          label: "ARN Number",
          placeholder: "Enter ARN Number",
          required: true,
        },
        {
          type: "date",
          id: "pft_applicationDate",
          label: "Application Date",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
        {
          type: "select",
          id: "pft_applicationSubStatus",
          label: "Application Sub Status",
          options: [
            { value: "pendingForApproval", label: "Pending for Approval" },
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
    ...(data?.pft_applicationSubStatus === "approved"
      ? [
        {
          type: "date",
          id: "pft_inactive_dateOfApproval",
          label: "Date of Approval",
          placeholder: "DD-Mon-YYYY",
          required: true,
        },
      ]
      : []),
  ];

  return fields;
};

const statusOptions = [
  { value: "", label: "All" },
  { value: "Pending for Apply", label: "Pending for Apply" },
  { value: "applied", label: "Applied" },
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
    placeholder: "Search Company",
    required: true,
  },
  {
    type: "select",
    id: "userId",
    label: "Assigned To",
    options: { value: "All", label: "All" },
    defaultValue: "All",
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
      { value: "professionalTax", label: "Professional Tax" },
    ],
  },
  {
    type: "select",
    id: "status",
    label: "Status",
    options: statusOptions,
    defaultValue: "All",

    required: false,
  },
  {
    type: "select",
    id: "applicationSubStatus",
    label: "Application Substatus",
    defaultValue: "All",

    options: applicationSubstatusOptions, // Add the options here
    required: false,
  },
];
