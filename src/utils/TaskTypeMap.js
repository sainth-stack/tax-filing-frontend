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
