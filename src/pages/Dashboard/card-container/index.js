import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import SelectInput from "../../../components/select";

const Header = ({
  children,
  
  title,
  columns,
  data,
  fileName = "exported_data",
  type,
  setType,
  payment = false,
}) => {
  console.log("columns", columns);
  console.log("data from 4th graphs", data)
  
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  /* ex[port casv fucntion] */

  const handleExportCSV = () => {
    if (!Array.isArray(columns) || columns.length === 0) {
      console.error("Invalid columns format. Expected an array.");
      return;
    }

    const headers = columns.map((col) => col.header).join(",");

    const rows = data.map((row) =>
      columns
        .map((col) => {
          const keys = col.key.split(".");
          let value = row;
          keys.forEach((key) => (value = value ? value[key] : "")); // Fallback to empty string
          return `"${value !== undefined ? value : ""}"`; // Ensure undefined is replaced
        })
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    handleMenuClose();
  };

  /* expoert as pdf */




const handleExportAsPDF = () => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const doc = new jsPDF("landscape");
  doc.setFontSize(16);
  doc.text("Company Data Report", 14, 15); // Report title

  const maxColumnsPerPage = 6; // Maximum columns per page
  const totalColumns = columns.length;

  // Prepare data dynamically
  const tableData = data.map((row) =>
    columns.map((col) => {
      let value = col.key
        .split(".")
        .reduce(
          (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""),
          row
        );

      // Custom format for date columns
      if (col.key === "updatedAt" && value) {
        const date = new Date(value);
        value = `${String(date.getDate()).padStart(2, "0")}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${date.getFullYear()} ${date
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .toUpperCase()}`;
      }

      return value || "N/A"; // Default to "N/A" for null or undefined
    })
  );

  // Split columns into pages
  const chunks = [];
  for (let i = 0; i < totalColumns; i += maxColumnsPerPage) {
    chunks.push(columns.slice(i, i + maxColumnsPerPage));
  }

  // Add pages with chunks of columns
  chunks.forEach((chunk, index) => {
    if (index > 0) doc.addPage(); // Add new page for subsequent chunks

    const pageData = tableData.map((row) =>
      row.slice(index * maxColumnsPerPage, (index + 1) * maxColumnsPerPage)
    );

    doc.text(
      index === 0
        ? "Company Data Report"
        : "Company Data Report (Continued)",
      14,
      15
    ); // Add title

    doc.autoTable({
      head: [chunk.map((col) => col.header)],
      body: pageData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { top: 20 },
    });
  });

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};




  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <h2
        style={{
          textAlign: "start",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {title}
      </h2>
      <Grid style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        {payment && (
          <SelectInput
            id="month"
            className="shadow-sm ml-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            default1={"Payment Type"}
            options={[
              { value: "all", label: "All" },
              { value: "filing", label: "Monthly Filing" },
              { value: "payment", label: "Monthly Payment" },
            ]}
            labelStyles={{ fontWeight: 500 }}
          />
        )}
        <IconButton
          onClick={handleMenuOpen}
          // sx={{
          //     position: "relative",
          //     left: "35rem",
          //     top: "2.5rem",
          // }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
          <MenuItem onClick={handleExportAsPDF}>Export as PDF</MenuItem>
        </Menu>
      </Grid>
    </div>
  );
};

export default Header;
