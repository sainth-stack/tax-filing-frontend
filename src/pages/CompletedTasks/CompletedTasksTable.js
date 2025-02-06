import React, { useEffect, useState } from "react";
 import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import moment from "moment";

import Accordian from "../../components/Accordian";
import Loader from "../../components/helpers/loader";
import SortableTableHeader from "../../components/table/SortableTableHeader";
import { toast } from "react-toastify";
import { getTaskDisplayName } from "../../utils/TaskTypeMap";
import TaskDetailsPopup from './../../components/common/TaskDetailsPopup';
import { useNavigate } from "react-router";
import {  Visibility } from "@mui/icons-material";


const theme = createTheme({
  typography: {
    fontFamily: "Work Sans, Arial",
  },
  components: {
    MuiTable: {
      styleOverrides: {},
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "none",
          padding: "12px 24px",
          backgroundColor: "#fff",
          "&:first-of-type": {
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "0px",
          },
          "&:last-of-type": {
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "0px",
          },
        },
        head: {
          backgroundColor: "#f5f5f5",
          fontWeight: 700,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  },
});

export default function CompletedTasksTable({
  tasks,
  handleDelete,
  setCompanyId,
  formData,
  page,
  pageSize,
  setTasks,
  setPageSize,
  setPage,
  totalTasks,
  fetchAllTasks,
  dataLoading,
}) {
  console.log(
    "chekign total tasks ",
    totalTasks,
    "total page size",
    pageSize,
    "Page :",
    page
  );

  const navigate = useNavigate();

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    tasks: [],
    companies: [],
  });

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sno");

  // 0 is the default starting page
  // Default rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchAllTasks(newPage, pageSize);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 5)); // Convert to number
    setPage(0); // Reset to the first page when rows per page changes
  };

  const handleEditForm = (id) => {
    setCompanyId(id);
  };

  const handleRequestSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };


  const handleClick = (task) => {
    console.log("Task clicked", task);

    // Store task in sessionStorage when clicked
    sessionStorage.setItem("task", JSON.stringify(task));

    // Navigate to the tasks page with the task
    navigate("/tasks", { state: { task } });
  };

  useEffect(() => {
    // Check if the task exists in sessionStorage on component mount
    const savedTask = sessionStorage.getItem("task");

    if (savedTask) {
      const task = JSON.parse(savedTask);
      console.log("Restored task:", task);
      // You can use the task here if needed
    }

    // Cleanup: Remove task from sessionStorage on component unmount or refresh
    return () => {
      sessionStorage.removeItem("task");
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const sortedTasks = tasks.sort((a, b) => {
    if (orderBy === "company") {
      return order === "asc"
        ? (a.company || "").localeCompare(b.company || "")
        : (b.company || "").localeCompare(a.company || "");
    }
    if (orderBy === "taskName") {
      return order === "asc"
        ? (a.taskName || "").localeCompare(b.taskName || "")
        : (b.taskName || "").localeCompare(a.taskName || "");
    }
    if (orderBy === "dueDate") {
      return order === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (orderBy === "status") {
      return order === "asc"
        ? (a.applicationStatus || "").localeCompare(b.applicationStatus || "")
        : (b.applicationStatus || "").localeCompare(a.applicationStatus || "");
    }
    if (orderBy === "assignedTo") {
      return order === "asc"
        ? (a.assignedTo || "").localeCompare(b.assignedTo || "")
        : (b.assignedTo || "").localeCompare(a.assignedTo || "");
    }
    if (orderBy === "applicationSubStatus") {
      return order === "asc"
        ? (a.applicationSubStatus || "").localeCompare(
            b.applicationSubStatus || ""
          )
        : (b.applicationSubStatus || "").localeCompare(
            a.applicationSubStatus || ""
          );
    }
    return 0; // Default case, no sorting
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TableContainer
        component={Paper}
        className="container my-4 shadow-md rounded-lg"
        sx={{ boxShadow: "none" }}
      >
        <Table
          className="table-auto"
          sx={{ minWidth: 650 }}
          aria-label="tasks table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left" padding="normal">
                S.NO
              </TableCell>

              <SortableTableHeader
                columnId="company"
                label="Company"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="taskName"
                label="Task Name"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="dueDate"
                label="Due Date"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="status"
                label="Status"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="assignedTo"
                label="Assigned To"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="applicationSubStatus"
                label="Application Sub Status"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />

              <TableCell align="left" padding="normal">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataLoading && dataLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <div className="flex justify-center items-center py-4">
                    <Loader size={30} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task, index) => (
                <TableRow key={task._id || index} sx={{ height: "48px" }}>
                  <TableCell align="left" padding="normal">
                    {page * pageSize + index + 1}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    {task.company || "N/A"}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    {getTaskDisplayName(
                      task.taskName,
                      task.taskType,
                      task.gstMonthly_gstType
                    )}
                  </TableCell>

                  <TableCell align="left" padding="normal">
                    {task.dueDate
                      ? moment(task.dueDate).format("DD-MMM-YYYY")
                      : "N/A"}
                  </TableCell>

                  <TableCell align="left" padding="normal">
                    {task.applicationStatus || "N/A"}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    {task.assignedName || "N/A"}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    {task.applicationSubStatus || "N/A"}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    <IconButton
                      aria-label="View"
                      size="small"
                      onClick={() => handleClick(task)}
                    >
                      <Visibility
                        fontSize="inherit"
                        className="text-green-400 z-0 bg-gray-50 rounded"
                      />
                    </IconButton>

                    <IconButton
                      aria-label="Completed"
                      size="small"
                      onClick={() => toast.info("Task Completed !")}
                    >
                      <DoneOutlineIcon
                        fontSize="inherit"
                        className="text-green-400 bg-gray-100 rounded"
                      />
                    </IconButton>
                    {/* <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDelete(task._id)}
                    >
                      <DeleteOutline
                        fontSize="inherit"
                        className="text-red-400 bg-gray-100 rounded"
                      />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5]} // Options for the number of rows per page
          component="div"
          count={totalTasks} // Total number of tasks
          rowsPerPage={pageSize} // Number of rows per page
          page={page}
          onPageChange={handleChangePage} // Update the page
          onRowsPerPageChange={handleChangeRowsPerPage} // Update the rows per page
          className="border-t border-gray-200"
          sx={{
            boxShadow: "none",
            border: "none",
          }}
        />
      </TableContainer>
      {/* 
      <TaskDetailsPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupContent.title}
        tasks={popupContent.tasks}
        companies={popupContent.companies}
        onTaskClick={handleTaskClick}
      /> */}
      <Accordian />
    </ThemeProvider>
  );
}
