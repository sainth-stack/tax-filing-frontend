export const sections = [
  {
    title: "Company Details",
    fields: [
      {
        type: "text",
        id: "companyDetails.companyName",
        label: "Company",
        required: true,
      },
      {
        type: "select",
        id: "companyDetails.constitution",
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
        id: "companyDetails.clientStatus",
        label: "Client Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        required: true,
      },
      {
        type: "text",
        id: "companyDetails.authorisedPerson",
        label: "Authorised Person",
        required: true,
      },
      {
        type: "text",
        id: "companyDetails.phone",
        label: "Phone",
        required: true,
      },
      {
        type: "text",
        id: "companyDetails.mailId",
        label: "Mail ID",
        required: true,
      },
    ],
  },
  {
    title: "Income Tax",
    fields: [
      {
        type: "select",
        id: "incomeTax.incomeTax",
        label: "Income Tax",
        options: [
          { value: "YES", label: "yes" },
          { value: "NO", label: "no" },
        ],
        required: true,
      },
      { type: "text", id: "incomeTax.pan", label: "PAN", required: true },
      {
        type: "password",
        id: "incomeTax.incomeTaxPassword",
        label: "Income Tax Password",
        required: true,
      },
    ],
  },
  {
    title: "GST",
    fields: [
      { type: "text", id: "gst.gstin", label: "GSTIN", required: true },
      {
        type: "text",
        id: "gst.gstUserName",
        label: "GST User Name",
        required: true,
      },
      {
        type: "password",
        id: "gst.gstPassword",
        label: "GST Password",
        required: true,
      },
      {
        type: "text",
        id: "gst.gstStatus",
        label: "GST Status",
        required: true,
      },
      {
        type: "text",
        id: "gst.eWayBillUsername",
        label: "E-WayBill Username",
        required: true,
      },
      {
        type: "password",
        id: "gst.eWayBillPassword",
        label: "E-WayBill Password",
        required: true,
      },
    ],
  },
  {
    title: "Employer State Insurance",
    fields: [
      {
        type: "text",
        id: "esi.esiNumber",
        label: "ESI Number",
        required: true,
      },
      {
        type: "text",
        id: "esi.esiUserId",
        label: "ESI User ID",
        required: true,
      },
      {
        type: "password",
        id: "esi.esiPassword",
        label: "ESI Password",
        required: true,
      },
    ],
  },
  {
    title: "Provident Fund",
    fields: [
      {
        type: "text",
        id: "providentFund.pfNumber",
        label: "PF Number",
        required: true,
      },
      {
        type: "text",
        id: "providentFund.pfUserId",
        label: "PF User ID",
        required: true,
      },
      {
        type: "password",
        id: "providentFund.pfPassword",
        label: "PF Password",
        required: true,
      },
    ],
  },
  {
    title: "Professional Tax",
    fields: [
      {
        type: "text",
        id: "professionalTax.ptEcNumber",
        label: "PT EC Number",
        required: true,
      },
      {
        type: "text",
        id: "professionalTax.ptUsername",
        label: "PT Username",
        required: true,
      },
      {
        type: "password",
        id: "professionalTax.ptPassword",
        label: "PT Password",
        required: true,
      },
      {
        type: "text",
        id: "professionalTax.ptNumber",
        label: "PT Number",
        required: true,
      },
    ],
  },
  {
    title: "TDS",
    fields: [
      { type: "text", id: "tds.tan", label: "TAN", required: true },
      {
        type: "password",
        id: "tds.tanPassword",
        label: "TAN Password",
        required: true,
      },
      {
        type: "text",
        id: "tds.tracesUsername",
        label: "Traces Username",
        required: true,
      },
      {
        type: "password",
        id: "tds.tracesPassword",
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
        id: "shopCommercialEstablishment.seNumber",
        label: "SE Number",
        required: true,
      },
      {
        type: "text",
        id: "shopCommercialEstablishment.seUsername",
        label: "SE Username",
        required: true,
      },
      {
        type: "password",
        id: "shopCommercialEstablishment.sePassword",
        label: "SE Password",
        required: true,
      },
      {
        type: "date",
        id: "shopCommercialEstablishment.seRenewalDate",
        label: "SE Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "MSME/Udyam",
    fields: [
      {
        type: "text",
        id: "msme.msmeNumber",
        label: "MSME Number",
        required: true,
      },
    ],
  },
  {
    title: "FSSAI",
    fields: [
      {
        type: "text",
        id: "fssai.fssaiNumber",
        label: "FSSAI Number",
        required: true,
      },
      {
        type: "text",
        id: "fssai.fssaiUsername",
        label: "FSSAI Username",
        required: true,
      },
      {
        type: "password",
        id: "fssai.fssaiPassword",
        label: "FSSAI Password",
        required: true,
      },
      {
        type: "date",
        id: "fssai.fssaiRenewalDate",
        label: "FSSAI Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "Factory Licence",
    fields: [
      {
        type: "text",
        id: "factoryLicense.flNumber",
        label: "FL Number",
        required: true,
      },
      {
        type: "text",
        id: "factoryLicense.flUsername",
        label: "FL User Name",
        required: true,
      },
      {
        type: "password",
        id: "factoryLicense.flPassword",
        label: "FL Password",
        required: true,
      },
      {
        type: "date",
        id: "factoryLicense.flRenewalDate",
        label: "FL Renewal Date",
        required: true,
      },
    ],
  },
  {
    title: "Import Export Code",
    fields: [
      {
        type: "text",
        id: "importExport.iecNumber",
        label: "IEC Number",
        required: true,
      },
      {
        type: "text",
        id: "importExport.dgftUsername",
        label: "DGFT Username",
        required: true,
      },
      {
        type: "password",
        id: "importExport.dgftPassword",
        label: "DGFT Password",
        required: true,
      },
      {
        type: "text",
        id: "importExport.icegateUsername",
        label: "ICEGATE Username",
        required: true,
      },
      {
        type: "password",
        id: "importExport.icegatePassword",
        label: "ICEGATE Password",
        required: true,
      },
    ],
  },
  {
    title: "Partnership Firm Form C",
    fields: [
      {
        type: "text",
        id: "partnershipFirmFormC.formCNumber",
        label: "Form C Number",
        required: true,
      },
    ],
  },
  {
    title: "Shram Suvidha Portal",
    fields: [
      {
        type: "text",
        id: "shramSuvidhaPortal.lin",
        label: "LIN",
        required: true,
      },
      {
        type: "text",
        id: "shramSuvidhaPortal.ssUsername",
        label: "S S Username",
        required: true,
      },
      {
        type: "password",
        id: "shramSuvidhaPortal.ssPassword",
        label: "S S Password",
        required: true,
      },
    ],
  },
  {
    title: "MCA",
    fields: [
      { type: "text", id: "mca.cin", label: "CIN/LLP", required: true },
      {
        type: "text",
        id: "mca.mcaUsername",
        label: "MCA Username",
        required: true,
      },
      {
        type: "password",
        id: "mca.mcaPassword",
        label: "MCA Password",
        required: true,
      },
      {
        type: "text",
        id: "mca.bankOverdraftCashCreditRenewalDate",
        label: "Bank Overdraft/ Cash Credit Renewal Date",
      },
    ],
  },
];

export const services = [
  {
    title: "Service Form",
    fields: [
      {
        type: "text",
        id: "serviceName",
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
        id: "effectiveFrom",
        label: "Effective From",
        required: true,
      },
      {
        type: "date",
        id: "effectiveTo",
        label: "Effective To",
        required: true,
      },
    ],
  },
];
