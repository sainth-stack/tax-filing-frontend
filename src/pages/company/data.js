export const sectionsData = (data) => {
  const isClientInactive = data?.companyDetails?.clientStatus === "inactive";
  const isIncomeTaxInactive = data?.incomeTax?.status === "inactive";
  const isGstInactive = data?.gst?.status === "inactive";

  const esiInactive = data?.esi?.status === "inactive";
    const isTDSInactive = data?.tds?.status === "inactive";
   const isPfInactive = data?.providentFund?.status === "inactive";
   const isprofessionalTax = data?.professionalTax?.status === "inactive";
   const isMSMEInactive =
     data?.msme?.status === "inactive";

    const isfactoryLicenseInactive = data?.factoryLicense?.status === "inactive";

    const isimportExportInactive = data?.importExport?.status === "inactive";

    const isFssaiInactive =
      data?.fssai?.status === "inactive";

    const isshopCommercialEstablishmentInactive =
      data?.shopCommercialEstablishment?.status === "inactive";

    const ispartnershipFirmFormCInActive =
      data?.ispartnershipFirmFormCInActive?.status === "inactive";

    const isshramSuvidhaPortalInactive =
      data?.isshramSuvidhaPortalInactive?.status === "inactive";

    const isMCAInactive =
      data?.mca?.status === "inactive";

   ;

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
            { value: "LLP", label: "LLP" },
          ],
          // required: true,
        },
        ...(data?.companyDetails?.constitution === "Partnership"
          ? [
              {
                type: "select",
                id: "companyDetails.subConstitution",
                label: "Sub Constitution",
                options: [
                  { value: "registered", label: "Registered" },
                  { value: "unregistered", label: "UnRegistered" },
                  { value: "llp", label: "LLP" },
                ],
                required: true,
              },
            ]
          : []),
        {
          type: "select",
          id: "companyDetails.clientStatus",
          label: "Client Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
          // required: true,
        },
        {
          type: "text",
          id: "companyDetails.authorisedPerson",
          label: "Authorised Person",
          // required: true,
        },
        {
          type: "text",
          id: "companyDetails.phone",
          label: "Phone",
          // required: true,
        },
        {
          type: "text",
          id: "companyDetails.mailId",
          label: "Mail ID",
          required: true,
        },
        {
          type: "text",
          id: "companyDetails.pan",
          label: "PAN",
          required: true,
        },
        {
          type: "date",
          id: "companyDetails.effectiveFrom",
          label: "Effective From",
          required: true,
        },
        {
          type: "date",
          id: "companyDetails.effectiveTo",
          label: "Effective To",
          required: isClientInactive,
        },
        {
          type: "textarea",
          id: "companyDetails.companyAddress",
          label: "Company Address",
          // required: true,
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
        },
        {
          type: "text",
          id: "companyDetails.pan",
          label: "PAN",
          readOnly: true,
        },
        {
          type: "text",
          id: "incomeTax.incomeTraceTaxUsername",
          label: "Traces Username",
        },
        {
          type: "text",
          id: "incomeTax.incomeTraceTaxPassword",
          label: "Traces Password",
        },
        {
          type: "password",
          id: "incomeTax.incomeTaxPassword",
          label: "Password",
        },
        {
          type: "date",
          id: "incomeTax.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "incomeTax.effectiveTo",
          label: "Effective To",
          required: isIncomeTaxInactive,
        },
        {
          type: "file",
          id: "incomeTax.approvalCertificate",
          label: "PAN",
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
        },
        { type: "text", id: "gst.gstin", label: "GSTIN", required: true },
        {
          type: "text",
          id: "gst.gstUserName",
          label: "GST User Name",
        },
        {
          type: "password",
          id: "gst.gstPassword",
          label: "GST Password",
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
        },
        {
          type: "password",
          id: "gst.eWayBillPassword",
          label: "E-WayBill Password",
        },
        {
          type: "date",
          id: "gst.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "gst.effectiveTo",
          label: "Effective To",
          required: isGstInactive,
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
        },
        // {
        //   type: "Date",
        //   id: "gst.dueDateReturn",
        //   label: "Due Date for GST Returns",
        //   // required: true,
        // },
        {
          type: "file",
          id: "gst.approvalCertificate",
          label: "GST Certificate",
        },
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
        },
        {
          type: "text",
          id: "esi.esiNumber",
          label: "ESI Number",
        },
        {
          type: "text",
          id: "esi.esiUserId",
          label: "ESI User ID",
        },
        {
          type: "password",
          id: "esi.esiPassword",
          label: "ESI Password",
        },
        {
          type: "date",
          id: "esi.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "esi.effectiveTo",
          label: "Effective To",
          required: esiInactive,
        },
        {
          type: "file",
          id: "esi.approvalCertificate",
          label: "ESI Certificate",
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
        },
        {
          type: "text",
          id: "providentFund.pfNumber",
          label: "PF Number",
        },
        {
          type: "text",
          id: "providentFund.pfUserId",
          label: "PF User ID",
        },
        {
          type: "password",
          id: "providentFund.pfPassword",
          label: "PF Password",
        },
        {
          type: "date",
          id: "providentFund.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "providentFund.effectiveTo",
          label: "Effective To",
           required: isPfInactive,
        },
        {
          type: "file",
          id: "providentFund.approvalCertificate",
          label: "PF Certificate",
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
        },
        {
          type: "text",
          id: "professionalTax.ptEcNumber",
          label: "PT EC Number",
        },
        {
          type: "text",
          id: "professionalTax.ptUsername",
          label: "PT Username",
        },
        {
          type: "password",
          id: "professionalTax.ptPassword",
          label: "PT Password",
        },
        {
          type: "text",
          id: "professionalTax.ptEcUsername",
          label: "PTEC Username",
        },
        {
          type: "password",
          id: "professionalTax.ptEcPassword",
          label: "PTEC Password",
        },
        {
          type: "text",
          id: "professionalTax.ptNumber",
          label: "PT Number",
        },
        {
          type: "date",
          id: "professionalTax.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "professionalTax.effectiveTo",
          label: "Effective To",
           required: isprofessionalTax,
        },
        {
          type: "file",
          id: "professionalTax.approvalCertificate",
          label: "PT Certificate ",
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
        },
        { type: "text", id: "tds.tan", label: "TAN", required: true },
        {
          type: "password",
          id: "tds.tanPassword",
          label: "TAN Password",
        },
        {
          type: "text",
          id: "tds.tracesUsername",
          label: "Traces Username",
        },
        {
          type: "password",
          id: "tds.tracesPassword",
          label: "Traces Password",
        },
        {
          type: "date",
          id: "tds.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "tds.effectiveTo",
          label: "Effective To",
           required: isTDSInactive,
        },
        {
          type: "file",
          id: "tds.approvalCertificate",
          label: "TAN",
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
        },
        {
          type: "text",
          id: "shopCommercialEstablishment.seNumber",
          label: "SE Number",
        },
        {
          type: "text",
          id: "shopCommercialEstablishment.seUsername",
          label: "SE Username",
        },
        {
          type: "password",
          id: "shopCommercialEstablishment.sePassword",
          label: "SE Password",
        },
        {
          type: "date",
          id: "shopCommercialEstablishment.seRenewalDate",
          label: "SE Renewal Date",
        },
        {
          type: "date",
          id: "shopCommercialEstablishment.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "shopCommercialEstablishment.effectiveTo",
          label: "Effective To",
           required: isshopCommercialEstablishmentInactive,
        },
        {
          type: "file",
          id: "shopCommercialEstablishment.approvalCertificate",
          label: "Shop and Commercial Establishment",
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
        },
        {
          type: "text",
          id: "msme.msmeNumber",
          label: "MSME Number",
        },
        {
          type: "date",
          id: "msme.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "msme.effectiveTo",
          label: "Effective To",
          required: isMSMEInactive,
        },
        {
          type: "file",
          id: "msme.approvalCertificate",
          label: "Udyam Certificate",
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
        },
        {
          type: "text",
          id: "fssai.fssaiNumber",
          label: "FSSAI Number",
        },
        {
          type: "text",
          id: "fssai.fssaiUsername",
          label: "FSSAI Username",
        },
        {
          type: "password",
          id: "fssai.fssaiPassword",
          label: "FSSAI Password",
        },
        {
          type: "date",
          id: "fssai.fssaiRenewalDate",
          label: "FSSAI Renewal Date",
        },
        {
          type: "date",
          id: "fssai.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "fssai.effectiveTo",
          label: "Effective To",
           required: isFssaiInactive,
        },
        {
          type: "file",
          id: "fssai.approvalCertificate",
          label: "FSSAI Certificate",
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
        },
        {
          type: "text",
          id: "factoryLicense.flNumber",
          label: "FL Number",
        },
        {
          type: "text",
          id: "factoryLicense.flUsername",
          label: "FL User Name",
        },
        {
          type: "password",
          id: "factoryLicense.flPassword",
          label: "FL Password",
        },
        {
          type: "date",
          id: "factoryLicense.flRenewalDate",
          label: "FL Renewal Date",
        },
        {
          type: "date",
          id: "factoryLicense.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "factoryLicense.effectiveTo",
          label: "Effective To",
           required: isfactoryLicenseInactive,
        },
        {
          type: "file",
          id: "factoryLicense.approvalCertificate",
          label: "Factory Licence",
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
        },
        {
          type: "text",
          id: "importExport.iecNumber",
          label: "IEC Number",
        },
        {
          type: "text",
          id: "importExport.dgftUsername",
          label: "DGFT Username",
        },
        {
          type: "password",
          id: "importExport.dgftPassword",
          label: "DGFT Password",
        },
        {
          type: "text",
          id: "importExport.icegateUsername",
          label: "ICEGATE Username",
        },
        {
          type: "password",
          id: "importExport.icegatePassword",
          label: "ICEGATE Password",
        },
        {
          type: "date",
          id: "importExport.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "importExport.effectiveTo",
          label: "Effective To",
          required: isimportExportInactive,
        },
        {
          type: "file",
          id: "importExport.approvalCertificate",
          label: "Approval Certificate",
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
        },
        {
          type: "text",
          id: "partnershipFirmFormC.formCNumber",
          label: "Form C Number",
        },
        {
          type: "date",
          id: "partnershipFirmFormC.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "partnershipFirmFormC.effectiveTo",
          label: "Effective To",
           required: ispartnershipFirmFormCInActive,
        },
        {
          type: "file",
          id: "partnershipFirmFormC.approvalCertificate",
          label: "Approval Certificate",
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
        },
        {
          type: "text",
          id: "shramSuvidhaPortal.lin",
          label: "LIN",
        },
        {
          type: "text",
          id: "shramSuvidhaPortal.ssUsername",
          label: "S S Username",
        },
        {
          type: "password",
          id: "shramSuvidhaPortal.ssPassword",
          label: "S S Password",
        },
        {
          type: "date",
          id: "shramSuvidhaPortal.effectiveFrom",
          label: "Effective From",
        },
        {
          type: "date",
          id: "shramSuvidhaPortal.effectiveTo",
          label: "Effective To",
          required: isshramSuvidhaPortalInactive
        },
        {
          type: "file",
          id: "shramSuvidhaPortal.approvalCertificate",
          label: "Approval Certificate",
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
        },
        { type: "text", id: "mca.cin", label: "CIN/LLP", required: true },
        {
          type: "text",
          id: "mca.mcaUsername",
          label: "MCA Username",
        },
        {
          type: "password",
          id: "mca.mcaPassword",
          label: "MCA Password",
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
        },
        {
          type: "date",
          id: "mca.effectiveTo",
          label: "Effective To",
         required:isMCAInactive
        },
        {
          type: "file",
          id: "mca.approvalCertificate",
          label: "Approval Certificate",
        },
      ],
      id: "mca",
    },
    /* {
      title: "Attachments",
      fields: [
        {
          type: "file",
          id: "attachments.panFile",
          label: "PAN",
        },
        {
          type: "file",
          id: "attachments.gstFile",
          label: "GST",
        },
        {
          type: "file",
          id: "attachments.esiFile",
          label: "ESI",
        },
        {
          type: "file",
          id: "attachments.pfFile",
          label: "Provident Fund",
        },
        {
          type: "file",
          id: "attachments.ptFile",
          label: "Professional Tax",
        },
        {
          type: "file",
          id: "attachments.tanFile",
          label: "TAN",
        },
        {
          type: "file",
          id: "attachments.shopEstablishmentFile",
          label: "Shop and Commercial Establishment",
        },
        {
          type: "file",
          id: "attachments.msmeFile",
          label: "MSME",
        },
        {
          type: "file",
          id: "attachments.fssaiFile",
          label: "FSSAI",
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
        {
          type: "file",
          id: "attachments.mcaFile",
          label: "MCA",
          required: true,
        },
        {
          type: "file",
          id: "attachments.cinFile",
          label: "CIN",
          required: true,
        },
      ],
    }, */
  ];
};

export const Dates = [
  {
    fields: [
      {
        type: "date",
        id: "effectiveFrom",
        label: "Effective From",
      },
      {
        type: "date",
        id: "effectiveTo",
        label: "Effective To",
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
      },
      {
        type: "select",
        id: "status",
        label: "Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
      {
        type: "date",
        id: "effectiveFrom",
        label: "Effective From",
      },
      {
        type: "date",
        id: "effectiveTo",
        label: "Effective To",
      },
    ],
  },
];
