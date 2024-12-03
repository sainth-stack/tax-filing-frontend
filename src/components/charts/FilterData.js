export const yearsJson = [
  { value: 2019, label: "2019" },
  { value: 2020, label: "2020" },
  { value: 2021, label: "2021" },
  { value: 2022, label: "2022" },
  { value: 2023, label: "2023" },
  { value: 2024, label: "2024" },
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
  { value: 2027, label: "2027" },
  { value: 2028, label: "2028" },
];

export const monthsJson = [
  { value: 0, label: "All" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];


export const taskTypeOptions = {
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
}


export const applicationSubstatusOptions = [
  { value: "gstr1", label: "GSTR1" },
  { value: "gstr3b", label: "GSTR3B" },
  { value: "gstNewRegistration", label: "GST - New Registration" },
  { value: "gstInactive", label: "GST - Closure" },
  { value: "gstRefund", label: "GST - Refund" },
  { value: "gstAmendments", label: "GST - Amendments" },
  { value: "gstMonthly", label: "GST - Monthly Filing" },
  { value: "gstMonthlyPayment", label: "GST - Monthly Payment" },
  { value: "gstRevocations", label: "GST - Revocations" },
];