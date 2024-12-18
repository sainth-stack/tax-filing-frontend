// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";

// /**
//  * Exports data as CSV.
//  * @param {Array} data - The data to export.
//  * @param {Array} columns - The column definitions.
//  * @param {String} fileName - The name of the file.
//  */
// export const exportAsCSV = (data, columns, fileName = "data.csv") => {
//   const formattedData = data.map((row) => {
//     const formattedRow = {};
//     columns.forEach((col) => {
//       const keys = col.key.split(".");
//       let value = row;
//       keys.forEach((key) => (value = value ? value[key] : ""));
//       formattedRow[col.header] = value;
//     });
//     return formattedRow;
//   });

//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   const buffer = XLSX.write(workbook, { bookType: "csv", type: "array" });
//   const blob = new Blob([buffer], { type: "text/csv" });
//   saveAs(blob, fileName);
// };

// /**
//  * Exports data as PDF.
//  * @param {Array} data - The data to export.
//  * @param {Array} columns - The column definitions.
//  * @param {String} fileName - The name of the file.
//  */
// export const exportAsPDF = (data, columns, fileName = "data.pdf") => {
//   const doc = new jsPDF();
//   doc.text("Exported Data", 10, 10);

//   const tableData = data.map((row) =>
//     columns.map((col) => {
//       const keys = col.key.split(".");
//       let value = row;
//       keys.forEach((key) => (value = value ? value[key] : ""));
//       return value;
//     })
//   );

//   const tableHeaders = columns.map((col) => col.header);

//   doc.autoTable({
//     head: [tableHeaders],
//     body: tableData,
//   });

//   doc.save(fileName);
// };
