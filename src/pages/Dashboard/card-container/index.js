import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import SelectInput from "../../../components/select";
import moment from "moment";
import { toast } from "react-toastify";

const Header = ({
  children,
  
  title,
  columns,
  data,
  fileName = "Company_Data",
  type,
  setType,
  payment = false, 
}) => {
  // console.log("data from 4th graphs", data)
  
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

  // Step 1: Count the number of tasks assigned to each person for each task type
  const taskCountMap = data.reduce((acc, row) => {
    const assignedName = row.assignedName;
    const taskType = row.taskType;

    if (assignedName && taskType) {
      const key = `${assignedName}-${taskType}`; // Combine assignedName and taskType as key
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  // Step 2: Add a column for 'taskCount' dynamically
  columns.push({
    header: "Total Tasks", // Name of the new column
    key: "taskCount",     // Key for the new column
  });

  // Step 3: Prepare CSV rows, including task count
  const headers = columns.map((col) => col.header).join(",");

  const rows = data.map((row) =>
    columns
      .map((col) => {
        if (col.key === "taskStatus") {
          const currentDate = moment(); // Get the current date using moment
          const dueDate = moment(row.dueDate); // Convert dueDate to moment
          const startDate = moment(row.startDate); // Convert startDate to moment
          const updatedAt = moment(row.updatedAt); // Get the updated date, if available

          if (updatedAt.isBefore(currentDate) && updatedAt.isSameOrBefore(dueDate)) {
            return `"Completed"`;
          }

          if (currentDate.isAfter(dueDate)) {
            return `"Overdue"`;
          }

          if (currentDate.isBetween(startDate, dueDate, null, "[]")) {
            return `"Pending"`;
          }

          return `"Pending"`;
        }

        // If the column key is 'taskCount', use the task count for the assigned person and task type
        if (col.key === "taskCount") {
          const assignedName = row.assignedName;
          const taskType = row.taskType;
          const key = `${assignedName}-${taskType}`; // Combine assignedName and taskType as key
          return `"${taskCountMap[key] || 0}"`;
        }

        // Otherwise, process the column's data as usual
        const keys = col.key.split(".");
        let value = row;
        keys.forEach((key) => (value = value ? value[key] : ""));
        return `"${value !== undefined ? value : ""}"`;
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
    toast.info("No data available to export.");
    return;
  }

  const doc = new jsPDF("landscape");
  doc.setFontSize(16);
  doc.text("Company Data Report", 14, 15); // Report title

  const maxColumnsPerPage = 6; // Maximum columns per page
  const totalColumns = columns.length;

  // Prepare task count map for each person and task type
  const taskCountMap = data.reduce((acc, row) => {
    const assignedName = row.assignedName;
    const taskType = row.taskType;

    if (assignedName && taskType) {
      const key = `${assignedName}-${taskType}`;
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  // Add "Total Tasks" column dynamically
  columns.push({
    header: "Total Tasks", // Name of the new column
    key: "taskCount", // Key for the new column
  });

  // Prepare data dynamically, including taskStatus logic and task count
  const tableData = data.map((row) =>
    columns.map((col) => {
      let value = col.key
        .split(".")
        .reduce(
          (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""),
          row
        );

      // Handle taskStatus logic dynamically
      if (col.key === "taskStatus") {
        const currentDate = moment(); // Get current date
        let dueDate = moment(row.dueDate); // Get dueDate
        let startDate = moment(row.startDate); // Get startDate
        const updatedAt = moment(row.updatedAt); // Get updatedAt date

        // Ensure proper date formatting for startDate and dueDate
        if (!startDate.isValid()) {
          startDate = moment(row.startDate, "YYYY-MM-DD"); // Adjust format if needed
        }
        if (!dueDate.isValid()) {
          dueDate = moment(row.dueDate, "YYYY-MM-DD"); // Adjust format if needed
        }

        // If the task is completed (based on updatedAt)
        if (
          updatedAt.isBefore(currentDate) &&
          updatedAt.isSameOrBefore(dueDate)
        ) {
          value = "Completed";
        } else if (currentDate.isAfter(dueDate)) {
          // If current date is greater than dueDate, it's overdue
          value = "Overdue";
        } else if (currentDate.isBetween(startDate, dueDate, null, "[]")) {
          // If current date is between start and due dates, it's pending
          value = "Pending";
        } else {
          value = "Pending"; // Default
        }
      }

      // Add task count for assignedName and taskType
      if (col.key === "taskCount") {
        const assignedName = row.assignedName;
        const taskType = row.taskType;
        const key = `${assignedName}-${taskType}`;
        value = taskCountMap[key] || 0;
      }

      // Custom format for date columns (Updated to handle startDate and dueDate)
      if (col.key === "updatedAt" && value) {
        const date = new Date(value);
        value = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}-${date.getFullYear()} ${date
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .toUpperCase()}`;
      }

      // Custom format for startDate and dueDate (Optional: you can adjust these formats)
      if (col.key === "startDate" && value) {
        const date = moment(value); // Convert startDate to moment
        value = date.isValid()
          ? date.format("MM-DD-YYYY") // You can change the format here
          : "Invalid Date";
      }

      if (col.key === "dueDate" && value) {
        const date = moment(value); // Convert dueDate to moment
        value = date.isValid()
          ? date.format("MM-DD-YYYY") // You can change the format here
          : "Invalid Date";
      }

      return value || "0"; // Default to "N/A" for null or undefined
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
      index === 0 ? "Company Data Report" : "Company Data Report (Continued)",
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
        margin:'0px 0px 20px 0px'
      }}
    >
      <h2
        style={{
          textAlign: "start",
          fontSize: "15.5px",
          fontWeight: 600,
          color:"#2B3674",
          // margin:".5rem 0  0 0.5rem",
          fontFamily: "Inter",
          lineHeight: "20.7px",
          letterSpacing: "0px",
          display:'flex',
          alignItems:'center'
          // marginBottom:"40px"

        }}
      >
        {title}
      </h2>

      <br />
      <Grid style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        {payment && (
          <SelectInput style={{}}
            id="month"
            className="ml-2 shadow-sm"
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
  sx={{
    width: "23.9px",
    height: "23.9px",
    backgroundColor: "#F4F7FE", 
    borderRadius: "6px",
    opacity: 1,
    transform: "rotate(-90deg)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // marginTop:"-40px",
    "&:hover": {
      backgroundColor: "#E0E5F2", 
    },
  }}
>
  <MoreVertIcon sx={{ fontSize: "16px", color: "#4318FF" }} /> 
</IconButton>

<Menu
  anchorEl={menuAnchorEl}
  open={isMenuOpen}
  onClose={handleMenuClose}
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#F4F7FE", 
      borderRadius: "6px",
    },
  }}
>
  <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
  <MenuItem onClick={handleExportAsPDF}>Export as PDF</MenuItem>
</Menu>

      </Grid>
    </div>
  );
};

export default Header;
