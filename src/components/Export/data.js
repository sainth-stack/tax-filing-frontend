import moment from "moment";

export const FirstGraphColumns = [
  { header: "Company Name", key: "companyDetails.companyName", width: 20 },
  { header: "Constitution", key: "companyDetails.constitution", width: 15 },
  {
    header: "Client Status",
    key: "companyDetails.clientStatus",
    width: 12,
  },
  {
    header: "Authorised Person",
    key: "companyDetails.authorisedPerson",
    width: 20,
  },
  { header: "Phone", key: "companyDetails.phone", width: 12 },
  { header: "Email", key: "companyDetails.mailId", width: 25 },
  { header: "PAN", key: "companyDetails.pan", width: 15 },
  {
    header: "Effective From",
    key: "companyDetails.effectiveFrom",
    width: 15,
  },
  { header: "Effective To", key: "companyDetails.effectiveTo", width: 15 },
  {
    header: "Company Address",
    key: "companyDetails.companyAddress",
    width: 50,
  },
  {
    header: "SubConstitution",
    key: "companyDetails.subConstitution",
    width: 50,
  },
  { header: "Updated Time", key: "updatedAt", width: 20 },
];

export const SecondGraphColumns = [
  { header: "Company Name", key: "companyDetails.companyName", width: 20 },
  { header: "Constitution", key: "companyDetails.constitution", width: 15 },
  {
    header: "Client Status",
    key: "companyDetails.clientStatus",
    width: 12,
  },
  {
    header: "Authorised Person",
    key: "companyDetails.authorisedPerson",
    width: 20,
  },
  { header: "Phone", key: "companyDetails.phone", width: 12 },
  { header: "Email", key: "companyDetails.mailId", width: 25 },
  { header: "PAN", key: "companyDetails.pan", width: 15 },

  {
    header: "ESI Number",
    key: "esi.esiNumber",
    width: 80,
  },
  /* change */
  {
    header: "GSTIN Number",
    key: "gst.gstin",
    width: 80,
  },
  {
    header: "PF Number",
    key: "providentFund.pfNumber",
    width: 80,
  },
  {
    header: "PTEC Number",
    key: "professionalTax.ptEcNumber",
    width: 80,
  },
  {
    header: "TDS Number",
    key: "tds.tan",
    width: 80,
  },
  {
    header: "SE Number",
    key: "shopCommercialEstablishment.seNumber",
    width: 80,
  },
  {
    header: "MSME Number",
    key: "msme.msmeNumber",
    width: 80,
  },
  {
    header: "FSSAI Number",
    key: "fssai.fssaiNumber",
    width: 80,
  },
  {
    header: "FL Number",
    key: "factoryLicense.flNumber",
    width: 80,
  },
  {
    header: "IE Number",
    key: "importExport.iecNumber",
    width: 80,
  },
  {
    header: " Form C Number",
    key: "partnershipFirmFormC.formCNumber",
    width: 80,
  },
  {
    header: "LI Number",
    key: "shramSuvidhaPortal.lin",
    width: 80,
  },
  {
    header: "MCA Number",
    key: "mca.cin",
    width: 80,
  },

  /* change */
  {
    header: "Effective From",
    key: "companyDetails.effectiveFrom",
    width: 20,
  },
  { header: "Effective To", key: "companyDetails.effectiveTo", width: 15 },
  {
    header: "Company Address",
    key: "companyDetails.companyAddress",
    width: 50,
  },
  {
    header: "SubConstitution",
    key: "companyDetails.subConstitution",
    width: 50,
  },
  { header: "Updated Time", key: "updatedAt", width: 20 },
];

export const ThirdGraphColumns = [
  // { header: "_id", key: "_id", width: 25 },
  { header: "Company", key: "company", width: 30 },
  { header: "Assigned Name", key: "assignedName", width: 30 },
  { header: "Priority", key: "priority", width: 15 },
  { header: "Start Date", key: "startDate", width: 20 },
  { header: "Due Date", key: "dueDate", width: 20 },
  { header: "Task Type", key: "taskType", width: 15 },
  { header: "Task Name", key: "taskName", width: 15 },

  { header: "GST Monthly GST Type", key: "gstMonthly_gstType", width: 20 },
  {
    header: "GST Monthly Filing Status",
    key: "gstMonthly_filingStatus",
    width: 25,
  },

  {
    header: "PF Monthly Filing Status",
    key: "pfMonthly_filingStatus",
    width: 20,
  },
  {
    header: "TDS TCS Monthly Filing Status",
    key: "tdstcsMonthly_filingStatus",
    width: 20,
  },

  {
    header: "Tax Monthly Filing Status",
    key: "taxMonthly_filingStatus",
    width: 20,
  },
  {
    header: "ESI Monthly Filing Status",
    key: "esiMonthly_filingStatus",
    width: 20,
  },
  {
    header: "PFT Monthly Filing Status",
    key: "pftMonthly_filingStatus",
    width: 20,
  },

  { header: "Updated At", key: "updatedAt", width: 25 },
  { header: "Auto", key: "auto", width: 10 },
];


export const FourthGraphColumns = [
  { header: "Company", key: "company", width: 30 },
  { header: "Assigned Name", key: "assignedName", width: 30 },
  { header: "Priority", key: "priority", width: 15 },
  { header: "Start Date", key: "startDate", width: 20 },
  { header: "Due Date", key: "dueDate", width: 20 },
  { header: "Task Type", key: "taskType", width: 15 },
  { header: "Task Name", key: "taskName", width: 15 },
  {
    header: "Task Status",
    key: "taskStatus", // The key to store task status
    width: 20,
    calculateStatus: (row) => {
      const currentDate = moment(); // Get the current date using moment
      const dueDate = moment(row.dueDate); // Convert dueDate to moment
      const startDate = moment(row.startDate); // Convert startDate to moment

      // If current date is greater than the due date, it's overdue
      if (currentDate.isAfter(dueDate)) {
        return "Overdue";
      }

      // If current date is between start and due dates, it's pending
      if (currentDate.isBetween(startDate, dueDate, null, "[]")) {
        return "Pending";
      }

      // If neither, return "Pending" (as default behavior)
      return "Pending";
    },
  },
   { header: "Updated At", key: "updatedAt", width: 25 },
];


export const FifthGraphColumns = [
  { header: "Company", key: "company", width: 30 },
  { header: "Assigned Name", key: "assignedName", width: 30 },
  { header: "Priority", key: "priority", width: 15 },
  { header: "Start Date", key: "startDate", width: 20 },
  { header: "Due Date", key: "dueDate", width: 20 },
  { header: "Task Type", key: "taskType", width: 15 },
  { header: "Task Name", key: "taskName", width: 15 },
  

  { header: "Updated At", key: "updatedAt", width: 25 },
];
