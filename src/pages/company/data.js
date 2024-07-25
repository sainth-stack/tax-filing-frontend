export const sections = [
  {
    title: "Company Details",
    fields: [
      {
        type: "text",
        id: "Company",
        label: "Company",
        required: true,
      },
      {
        type: "select",
        id: "constitution",
        label: "Constitution",
        options: [
          { value: "Partnership", label: "Partnership" },

          { value: "Proprietorship", label: "Proprietorship" },
          { value: "Private Limited", label: "Private Limited" },
          { value: "LLP", label: "LLP" },
        ],
        required: true,
      },
      {
        type: "select",
        id: "client-status",
        label: "Client Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        required: true,
      },
      {
        type: "text",
        id: "authorised-person",
        label: "Authorised Person",
        required: true,
      },
      { type: "text", id: "phone", label: "Phone", required: true },
      { type: "text", id: "mail-id", label: "Mail ID", required: true },
    ],
  },
  {
    title: "Employer State Insurance",
    fields: [
      { type: "text", id: "esi", label: "ESI", required: true },

      { type: "text", id: "esi-number", label: "ESI Number", required: true },
      { type: "text", id: "esi-user-id", label: "ESI User ID", required: true },
      {
        type: "password",
        id: "esi-password",
        label: "ESI Password",
        required: true,
      },
    ],
  },
  {
    title: "TDS",
    fields: [
      { type: "text", id: "TDS", label: "TDS", required: true },
      { type: "text", id: "tan", label: "TAN", required: true },
      {
        type: "password",
        id: "tan-password",
        label: "TAN Password",
        required: true,
      },
      {
        type: "text",
        id: "traces-username",
        label: "Traces Username",
        required: true,
      },
      {
        type: "password",
        id: "traces-password",
        label: "Traces Password",
        required: true,
      },
    ],
  },
  {
    title: "Shop and Commercial Establishment",
    fields: [
      {
        type: "text",
        id: "Shop and Commercial Establishment",
        label: "S & C  Establishment",
        required: true,
      },
      { type: "text", id: "se-number", label: "SE Number", required: true },

      { type: "text", id: "se-username", label: "SE Username", required: true },
      {
        type: "password",
        id: "se-password",
        label: "SE Password",
        required: true,
      },
      {
        type: "date",
        id: "se-renewal-date",
        label: "SE Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "MSME/Udyam",
    fields: [
      { type: "text", id: "msme-udyam", label: "MSME/Udyam", required: true },
      { type: "text", id: "msme-number", label: "MSME Number", required: true },
    ],
  },
  {
    title: "Import Export Code",
    fields: [
      { type: "text", id: "iec-code", label: "IEC Code", required: true },

      { type: "text", id: "iec-number", label: "IEC Number", required: true },
      {
        type: "text",
        id: "dgft-username",
        label: "DGFT Username",
        required: true,
      },
      {
        type: "password",
        id: "dgft-password",
        label: "DGFT Password",
        required: true,
      },
      {
        type: "text",
        id: "icegate-username",
        label: "ICEGATE Username",
        required: true,
      },
      {
        type: "password",
        id: "icegate-password",
        label: "ICEGATE Password",
        required: true,
      },
    ],
  },
  {
    title: "MCA",
    fields: [
      { type: "text", id: "MCA", label: "MCA", required: true },
      { type: "text", id: "cin-llp", label: "CIN/LLP", required: true },
      {
        type: "text",
        id: "mca-username",
        label: "MCA Username",
        required: true,
      },
      {
        type: "password",
        id: "mca-password",
        label: "MCA Password",
        required: true,
      },
      {
        type: "text",
        id: "bank-overdraft",
        label: "Bank Overdraft/ Cash Credit",
      },
      { type: "date", id: "renewal-date", label: "Renewal Date" },
    ],
  },
  {
    title: "Income Tax",
    fields: [
      {
        type: "select",
        id: "income-tax",
        label: "Income Tax",
        options: [
          { value: "YES", label: "yes" },

          { value: "NO", label: "no" },
        ],
        required: true,
      },
      { type: "text", id: "pan", label: "PAN", required: true },
      {
        type: "password",
        id: "income-tax-password",
        label: "Income Tax Password",
        required: true,
      },
    ],
  },
  {
    title: "Provident Fund",
    fields: [
      {
        type: "text",
        id: "pf-fund",
        label: "Provident Fund",
        required: true,
      },
      { type: "text", id: "pf-number", label: "PF Number", required: true },
      { type: "text", id: "pf-user-id", label: "PF User ID", required: true },
      {
        type: "password",
        id: "pf-password",
        label: "PF Password",
        required: true,
      },
    ],
  },
  /* {
    title: "ESI Number",
    fields: [
      { type: "text", id: "esi-number", label: "ESI Number", required: true },
      { type: "text", id: "esi-user-id", label: "ESI User ID", required: true },
      {
        type: "password",
        id: "esi-password",
        label: "ESI Password",
        required: true,
      },
    ],
  }, */
  {
    title: "GST",
    fields: [
      { type: "text", id: "gstin", label: "GSTIN", required: true },
      {
        type: "text",
        id: "gst-username",
        label: "GST User Name",
        required: true,
      },
      {
        type: "password",
        id: "gst-password",
        label: "GST Password",
        required: true,
      },
      { type: "text", id: "gst-status", label: "GST Status", required: true },
      {
        type: "text",
        id: "ewaybill-username",
        label: "E-WayBill Username",
        required: true,
      },
      {
        type: "password",
        id: "ewaybill-password",
        label: "E-WayBill Password",
        required: true,
      },
    ],
  },
  {
    title: "Professional Tax For Institution",
    fields: [
      {
        type: "text",
        id: "pt-ec-number",
        label: "PT EC Number",
        required: true,
      },
      {
        type: "text",
        id: "ec-user-name",
        label: "EC User Name",
        required: true,
      },
      {
        type: "password",
        id: "ec-password",
        label: "EC Password",
        required: true,
      },
      {
        type: "text",
        id: "professional-tax-employees",
        label: "PT Employees",
        required: true,
      },
      {
        type: "text",
        id: "pt-number",
        label: "PT Number",
        required: true,
      },
      {
        type: "text",
        id: "pt-username",
        label: "PT Username",
        required: true,
      },
      {
        type: "password",
        id: "pt-password",
        label: "PT Password",
        required: true,
      },
    ],
  },
  {
    title: "Factory Licence",
    fields: [
      {
        type: "text",
        id: "factory-licence-yes",
        label: "Factory Licence",
        required: true,
      },
      {
        type: "text",
        id: "factory-licence-number",
        label: "FL Number",
        required: true,
      },
      {
        type: "text",
        id: "fl-username",
        label: "FL User Name",
        required: true,
      },
      {
        type: "password",
        id: "fl-password",
        label: "FL Password",
        required: true,
      },
      {
        type: "date",
        id: "fl-renewal-date",
        label: "FL Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "FSSAI",
    fields: [
      {
        type: "text",
        id: "fssai",
        label: "FSSAI",
        required: true,
      },
      {
        type: "text",
        id: "fssai-number",
        label: "FSSAI Number",
        required: true,
      },
      {
        type: "text",
        id: "fssai-username",
        label: "FSSAI Username",
        required: true,
      },
      {
        type: "password",
        id: "fssai-password",
        label: "FSSAI Password",
        required: true,
      },
      {
        type: "date",
        id: "fssai-renewal-date",
        label: "FSSAI Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "Shram Suvidha Portal",
    fields: [
      {
        type: "text",
        id: "lin",
        label: "Shram Suvidha Portal",
        required: true,
      },
      { type: "text", id: "lin", label: "LIN", required: true },
      {
        type: "text",
        id: "ss-username",
        label: "S S Username",
        required: true,
      },
      {
        type: "password",
        id: "ss-password",
        label: "S S Password",
        required: true,
      },
    ],
  },
  {
    title: "Partnership Firm Form C",
    fields: [
      {
        type: "text",
        id: "Partnership Firm Form C",
        label: "PF  Form C",
        required: true,
      },
      {
        type: "text",
        id: "form-c-number",
        label: "Form C Number",
        required: true,
      },
    ],
  },
  {
    title: "Attachments",
    fields: [
      { type: "file", id: "pan-file", label: "PAN ", required: true },
      { type: "file", id: "gst-file", label: "GST ", required: true },
      { type: "file", id: "esi-file", label: "ESI ", required: true },
      { type: "file", id: "pf-file", label: "Provident Fund ", required: true },
      {
        type: "file",
        id: "pt-file",
        label: "Professional Tax ",
        required: true,
      },
      { type: "file", id: "tan-file", label: "TAN ", required: true },
      {
        type: "file",
        id: "shop-establishment-file",
        label: "Shop and Commercial Establishment ",
        required: true,
      },
      { type: "file", id: "msme-file", label: "MSME ", required: true },
      {
        type: "file",
        id: "fssai-file",
        label: "FSSAI ",
        required: true,
      },
      {
        type: "file",
        id: "factory-license-file",
        label: "Factory License ",
        required: true,
      },
      {
        type: "file",
        id: "import-export-file",
        label: "Import and Export ",
        required: true,
      },
      {
        type: "file",
        id: "partnership-formc-file",
        label: "Partnership Firm Form C ",
        required: true,
      },
      {
        type: "file",
        id: "shram-suvidha-file",
        label: "Shram Suvidha Portal ",
        required: true,
      },
      { type: "file", id: "mca-file", label: "MCA ", required: true },
      { type: "file", id: "cin-file", label: "CIN ", required: true },
    ],
  },
];

export const services = [
  {
    title: "Service Form",
    fields: [
      {
        type: "number",
        id: "serial-no",
        label: "S.No",
        required: true,
      },
      {
        type: "text",
        id: "service-name",
        label: "Service Name",
        required: true,
      },
      {
        type: "select",
        id: "status",
        label: "Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        required: true,
      },
      {
        type: "date",
        id: "effective-from",
        label: "Effective From",
        required: true,
      },
      {
        type: "date",
        id: "effective-to",
        label: "Effective To",
        required: true,
      },
      {
        type: "actions",
        id: "actions",
        label: "Actions",
        required: false,
      },
    ],
  },
];
