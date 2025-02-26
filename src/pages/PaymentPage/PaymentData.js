export const PaymentStaticData = (
  companiesdata = [],
  paymentType = "",
  activeTasks = []
) => {
  const allTaskTypes = [
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

  // Filter task types based on active tasks from the selected company
  const filteredTaskTypes = allTaskTypes.filter((task) =>
    activeTasks.includes(task.value)
  );

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
      multiple: false,
      options: filteredTaskTypes, // Only show active tasks
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

  if (paymentType === "monthlySubscription") {
    filteredTaskTypes.forEach((task) => {
      fields.push({
        type: "text",
        id: `amount_${task.value}`,
        label: `${task.label} Amount`,
        placeholder: `Enter amount for ${task.label}`,
      });
    });
  } else if (paymentType === "lumpsum") {
    fields.push({
      type: "text",
      id: "amount",
      label: "Lumpsum Amount",
      placeholder: "Enter lumpsum amount",
    });

    filteredTaskTypes.forEach((task) => {
      fields.push({
        type: "checkbox",
        id: `task_${task.value}`,
        label: `Include ${task.label}`,
      });
    });
  }

  return fields;
};
