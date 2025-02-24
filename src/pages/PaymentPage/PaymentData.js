export const PaymentStaticData = (companiesdata = [], PaymentType = "") => {
  const fields = [
    {
      type: "select",
      id: "company",
      label: "Company",
      options: companiesdata,
      multiple: false,
    },
    {
      type: "select",
      id: "taskType",
      label: "Task Type",
      multiple: false, // Only one task can be selected
      options: [
        { value: "gst", label: "GST" },
        { value: "providentFund", label: "Provident Fund" },
        { value: "incomeTax", label: "Income Tax" },
        { value: "tds", label: "TDS and TCS" },
        { value: "esi", label: "ESI" },
        { value: "professionalTax", label: "Professional Tax" },
        {
          value: "shopCommercialEstablishment",
          label: "Shop Commercial Establishment",
        },
        { value: "msme", label: "MSME" },
        { value: "fssai", label: "FSSAI" },
        { value: "factoryLicense", label: "Factory License" },
        { value: "importExport", label: "Import Export" },
        { value: "partnershipFirmFormC", label: "Partnership Firm Form C" },
        { value: "shramSuvidhaPortal", label: "ShramSuvidha Portal" },
        { value: "mca", label: "MCA" },
      ],
    },
    {
      type: "select",
      id: "paymentType",
      label: "Fee Type",
      options: [
        { value: "monthlySubscription", label: "Monthly Subscription" },
        { value: "lumpsum", label: "Lumpsum" },
      ],
    },
  ];

  const taskTypes = [
    { value: "gst", label: "GST" },
    { value: "providentFund", label: "Provident Fund" },
    { value: "incomeTax", label: "Income Tax" },
    { value: "tds", label: "TDS and TCS" },
    { value: "esi", label: "ESI" },
    { value: "professionalTax", label: "Professional Tax" },
    {
      value: "shopCommercialEstablishment",
      label: "Shop Commercial Establishment",
    },
    { value: "msme", label: "MSME" },
    { value: "fssai", label: "FSSAI" },
    { value: "factoryLicense", label: "Factory License" },
    { value: "importExport", label: "Import Export" },
    { value: "partnershipFirmFormC", label: "Partnership Firm Form C" },
    { value: "shramSuvidhaPortal", label: "ShramSuvidha Portal" },
    { value: "mca", label: "MCA" },
  ];

  if (PaymentType === "monthlySubscription") {
    // Add a text input for each task type
    taskTypes.forEach((task) => {
      fields.push({
        type: "text",
        id: `amount_${task.value}`,
        label: `${task.label} Amount`,
        placeholder: `Enter amount for ${task.label}`,
      });
    });
  } else if (PaymentType =="lumpsum") {
    // Single text input for total amount
    fields.push({
      type: "text",
      id: "amount",
      label: "Lumpsum Amount",
      placeholder: "Enter lumpsum amount",
    });

    // Checkboxes for selecting applicable tasks
    taskTypes.forEach((task) => {
      fields.push({
        type: "checkbox",
        id: `task_${task.value}`,
        label: `Include ${task.label}`,
      });
    });
  }

  return fields;
};
