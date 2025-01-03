export const isEffectiveToRequired = (data) => {
  // Define the sections to check
    const sections = [
      {
        key: "companyDetails",
        statusField: "clientStatus",
        label: "companyDetails",
      },
      { key: "incomeTax", statusField: "status", label: "incomeTax" },
      { key: "gst", statusField: "status", label: "gst" },
      { key: "esi", statusField: "status", label: "esi" },
      { key: "tds", statusField: "status", label: "tds" },
      { key: "providentFund", statusField: "status", label: "providentFund" },
      {
        key: "professionalTax",
        statusField: "status",
        label: "professionalTax",
      },
      { key: "msme", statusField: "status", label: "msme" },
      { key: "factoryLicense", statusField: "status", label: "factoryLicense" },
      { key: "importExport", statusField: "status", label: "importExport" },
      { key: "fssai", statusField: "status", label: "fssai" },
      {
        key: "shopCommercialEstablishment",
        statusField: "status",
        label: "shopCommercialEstablishment",
      },
      {
        key: "ispartnershipFirmFormCInActive",
        statusField: "status",
        label: "ispartnershipFirmFormCInActive",
      },
      {
        key: "isshramSuvidhaPortalInactive",
        statusField: "status",
        label: "isshramSuvidhaPortalInactive",
      },
      { key: "mca", statusField: "status", label: "mca" },
  
    ];

  
  for (const section of sections) {
    if (
      data[section.key]?.[section.statusField] === "inactive" &&
      !data[section.key]?.effectiveTo
    ) {
      return {
        isValid: false,
        message: `Please Fill All Required Fields in ${section.label}`,
      };
    }
  }

  
  return { isValid: true };
};



export const isGstStateRequired = (data) => {
  
  if (!data?.gst?.state || data.gst.state === "" || data.gst.state === "0") {
    return {
      isValid: false,
      message: "State field is required in GST.",
    };
  }

  return { isValid: true };
};

