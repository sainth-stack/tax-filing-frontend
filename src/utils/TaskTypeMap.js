export const taskTypeMap = {
  gstr3b: "GSTR3B",
  gstr1: "GSTR1",
  professionalTaxRegularMonthlyActivity: "Professional Tax",
  esiRegularMonthlyActivity: "Employees State Insurance",
  pfMonthly: "Provident Fund",
  tdsTcsMonthly: "TDS/TCS",
};


export const getTaskDisplayName = (taskName, taskType, gstMonthly_gstType) => {
  if (taskType === "gst") {
    return taskTypeMap[gstMonthly_gstType] || `${taskName} - Other Type`;
  }
  return taskTypeMap[taskName] || taskTypeMap.default;
};


export const GetTaskLabel = (taskType, gstin, registrationNumber) => {

  const label = taskType === "gst" ? "GSTIN" : "Registration Number";

  // const value = taskType === "GST" ? gstin : registrationNumber || "N/A";

  // return { label, value };
  return label
};


export const getTaskNumber = (taskType, companyName, companyData) => {
  console.log(taskType)
  const company = companyData?.filter(
    (company) => company.companyName === companyName
  )[0];

  console.log(company)

  if (!company) {
    return "Company not found for provided name"; 
  }

  switch (taskType) {
    case "providentFund":
      return company.providentFund?.pfNumber
        ? `Provident Fund Number: ${company.providentFund.pfNumber}`
        : "N/A";
    case "gst":
      return company.gst?.gstin ? `GSTIN: ${company.gst.gstin}` : "N/A";
    case "esi":
      return company.esi?.esiNumber ? `Registration Number: ${company.esi.esiNumber}` : "N/A";
    case "incomeTax":
      return company.incomeTax?.incomeTaxPassword
        ? `Income Tax Password: ${company.incomeTax.incomeTaxPassword}`
        : "N/A";
    case "professionalTax":
      return company.professionalTax?.ptNumber
          ? `Professional Tax Number: ${company.professionalTax.ptNumber}`
        : "N/A";
    case "tds":
      return company.tds?.tan ? `TDS/TCS Number: ${company.tds.tan}` : "N/A";
    case "shopCommercialEstablishment":
      return company.shopCommercialEstablishment?.seNumber
        ? `seNumber: ${company.shopCommercialEstablishment.seNumber}`
        : "N/A";
    case "msme":
      return company.msme?.msmeNumber
        ? `msmeNumber: ${company.msme.msmeNumber}`
        : "N/A";
    case "fssai": 
      return company.fssai?.fssaiNumber
        ? `fssaiNumber: ${company.fssai.fssaiNumber}`
        : "N/A";
    case "factoryLicense":
      return company.factoryLicense?.flNumber
        ? `flNumber: ${company.factoryLicense.flNumber}`
        : "N/A";
    case "importExport":
      return company.importExport?.iecNumber
        ? `iecNumber: ${company.importExport.iecNumber}`
        : "N/A";
    case "partnershipFirmFormC":
      return company.partnershipFirmFormC?.formCNumber
        ? `formCNumber: ${company.partnershipFirmFormC.formCNumber}`
        : "N/A";
    case "shramSuvidhaPortal":
      return company.shramSuvidhaPortal?.lin
        ? `lin: ${company.shramSuvidhaPortal.lin}`
        : "N/A";
    case "mca":
      return company.mca?.cin ? `cin: ${company.mca.cin}` : "N/A";
    default:
      return "Invalid task type"; // Return an error message for invalid task types
  }
};


