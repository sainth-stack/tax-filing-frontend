export const sectionsData = (data) => {
  return [
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
            { value: "PrivateLimited", label: "Private Limited" },
            /*  { value: "LLP", label: "LLP" }, */
          ],
          required: true,
        },
        ...(data?.companyDetails?.constitution === "Partnership" ? [
          {
            type: "select",
            id: "companyDetails.subConstitution",
            label: "Sub Constitution",
            options: [
              { value: "registered", label: "Registered" },
              { value: "unregistered", label: "UnRegistered" },
              { value: "llp", label: "LLP" },
              /*  { value: "LLP", label: "LLP" }, */
            ],
            required: true,
          },
        ] : []),
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
      id: "companyDetails",
    },
    {
      title: "Income Tax",
      fields: [
        {
          type: "select",
          id: "incomeTax.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
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
        {
          type: "date",
          id: "incomeTax.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "incomeTax.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "incomeTax",
    },
    {
      title: "GST",
      fields: [
        {
          type: "select",
          id: "gst.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        // {
        //   type: "text",
        //   id: "gst.gstStatus",
        //   label: "GST Status",
        //   required: true,
        // },
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
        {
          type: "date",
          id: "gst.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "gst.effectiveTo",
          label: "Effective To",
          required: true,
        },
        {
          type: "select",
          id: "gst.typeOfGstFiling",
          label: "Type Of GST Filing",
          options: [
            { value: "composition", label: "Composition" },
            { value: "QRMP", label: "QRMP" },
            { value: "Regular", label: "Regular" },
            /*  { value: "LLP", label: "LLP" }, */
          ],
          required: true,
        },
        {
          type: "file",
          id: "gst.approvalCertificate",
          label: "Approval Certificate",
          required: true,
        }
      ],
      id: "gst",
    },
    {
      title: "Employer State Insurance",
      fields: [
        {
          type: "select",
          id: "esi.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "esi.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "esi.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "esi",
    },
    {
      title: "Provident Fund",
      fields: [
        {
          type: "select",
          id: "providentFund.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "providentFund.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "providentFund.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "providentFund",
    },
    {
      title: "Professional Tax",
      fields: [
        {
          type: "select",
          id: "professionalTax.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "professionalTax.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "professionalTax.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "professionalTax",
    },
    {
      title: "TDS",
      fields: [
        {
          type: "select",
          id: "tds.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "tds.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "tds.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "tds",
    },
    {
      title: "Shop and Commercial Establishment",
      fields: [
        {
          type: "select",
          id: "shopCommercialEstablishment.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "shopCommercialEstablishment.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "shopCommercialEstablishment.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "shopCommercialEstablishment",
    },
    {
      title: "MSME/Udyam",
      fields: [
        {
          type: "select",
          id: "msme.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
        {
          type: "text",
          id: "msme.msmeNumber",
          label: "MSME Number",
          required: true,
        },
        {
          type: "date",
          id: "msme.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "msme.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "msme",
    },
    {
      title: "FSSAI",
      fields: [
        {
          type: "select",
          id: "fssai.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "fssai.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "fssai.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "fssai",
    },
    {
      title: "Factory Licence",
      fields: [
        {
          type: "select",
          id: "factoryLicense.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "factoryLicense.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "factoryLicense.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "factoryLicense",
    },
    {
      title: "Import Export Code",
      fields: [
        {
          type: "select",
          id: "importExport.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "importExport.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "importExport.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "importExport",
    },
    {
      title: "Partnership Firm Form C",
      fields: [
        {
          type: "select",
          id: "partnershipFirmFormC.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
        {
          type: "text",
          id: "partnershipFirmFormC.formCNumber",
          label: "Form C Number",
          required: true,
        },
        {
          type: "date",
          id: "partnershipFirmFormC.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "partnershipFirmFormC.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "partnershipFirmFormC",
    },
    {
      title: "Shram Suvidha Portal",
      fields: [
        {
          type: "select",
          id: "shramSuvidhaPortal.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "shramSuvidhaPortal.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "shramSuvidhaPortal.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "shramSuvidhaPortal",
    },
    {
      title: "MCA",
      fields: [
        {
          type: "select",
          id: "mca.status",
          label: "Status",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
          required: true,
        },
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
        {
          type: "date",
          id: "mca.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "mca.effectiveTo",
          label: "Effective To",
          required: true,
        },
      ],
      id: "mca",
    },
    {
      title: "Attachments",
      fields: [
        { type: "file", id: "attachments.panFile", label: "PAN", required: true },
        { type: "file", id: "attachments.gstFile", label: "GST", required: true },
        { type: "file", id: "attachments.esiFile", label: "ESI", required: true },
        {
          type: "file",
          id: "attachments.pfFile",
          label: "Provident Fund",
          required: true,
        },
        {
          type: "file",
          id: "attachments.ptFile",
          label: "Professional Tax",
          required: true,
        },
        { type: "file", id: "attachments.tanFile", label: "TAN", required: true },
        {
          type: "file",
          id: "attachments.shopEstablishmentFile",
          label: "Shop and Commercial Establishment",
          required: true,
        },
        {
          type: "file",
          id: "attachments.msmeFile",
          label: "MSME",
          required: true,
        },
        {
          type: "file",
          id: "attachments.fssaiFile",
          label: "FSSAI",
          required: true,
        },
        {
          type: "file",
          id: "attachments.factoryLicenseFile",
          label: "Factory License",
          required: true,
        },
        {
          type: "file",
          id: "attachments.importExportFile",
          label: "Import and Export",
          required: true,
        },
        {
          type: "file",
          id: "attachments.partnershipFormcFile",
          label: "Partnership Firm Form C",
          required: true,
        },
        {
          type: "file",
          id: "attachments.shramSuvidhaFile",
          label: "Shram Suvidha Portal",
          required: true,
        },
        { type: "file", id: "attachments.mcaFile", label: "MCA", required: true },
        { type: "file", id: "attachments.cinFile", label: "CIN", required: true },
      ],
    },
  ]
};

export const Dates = [
  {
    fields: [
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
