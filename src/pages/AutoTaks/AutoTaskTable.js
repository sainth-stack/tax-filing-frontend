import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SortableTableHeader from "../../components/table/SortableTableHeader";
import Accordian from "../../components/Accordian";
import Loader from "../../components/helpers/loader";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../const";
import ConfirmationPopup from "../../components/confirmation-popup";
import moment from "moment";
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

export default function AutoTasksTable({
  tasks,
  handleDelete,
  setCompanyId,
  formData,
  dataLoading,
  fetchTasks,
  page,
  pageSize,
  setPageSize,
  setPage,
  totalTasks,
  fetchAllTasks,
}) {


  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sno"); // default sorting by S.No
  const [openDialog, setOpenDialog] = useState(false);  // State to control the dialog visibility
  // const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState(null);  // Store the selected task for confirmation
  const [openDialog2, setOpenDialog2] = useState(false);  // State to control the dialog visibility
  const [id, setId] = useState('')
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchAllTasks(newPage, pageSize);
  };


  const handleAssignToMe = async (task) => {
    try {
      const finalDate = { ...task, assignedName: userId?.firstName, assignedTo: userId?._id }
      // Prepare form data for API
      const formDataToSubmit = new FormData();
      Object.keys(finalDate).forEach((key) => {
        formDataToSubmit.append(key, finalDate[key]);
      });

      // Submit form data
      if (finalDate._id) {
        try {
          await axios.put(
            `${base_url}/tasks/auto/${finalDate._id}`,
            formDataToSubmit
          );
          toast.success("Task Assigned Successfully");
        } catch (error) {
          toast.error("Failed to Assigned Task");
        }
      }
      fetchTasks();
    } catch (error) {
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 5)); // Convert to number
    setPage(0); // Reset to the first page when rows per page changes
  };

  const handleEditForm = (id) => {
    setCompanyId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

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
  const userId = JSON.parse(localStorage.getItem('user'));
  const handleConfirmAssign = () => {
    if (selectedTask) {
      handleAssignToMe(selectedTask);  // Pass the selected task to the handler
    }
    setOpenDialog(false);  // Close the dialog after confirming
  };
  const handleClickOpen = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleConfirmAssign2 = () => {
    handleDelete(id)
    setOpenDialog2(false);
  }

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
                Actions
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
              sortedTasks
                .map((task, index) => (
                  <TableRow key={task._id || index} sx={{ height: "48px" }}>
                    <TableCell align="left" padding="normal">
                      {page * pageSize + index + 1}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.company || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task?.taskName === "gstMonthly" ? (task?.taskName + "-" + task?.gstMonthly_gstType) : (task.taskName || "N/A")}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.dueDate ? moment(task.dueDate).format('DD-MMM-YYYY') : 'N/A'}
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
                      {
                        userId?._id !== task.assignedTo &&
                        <IconButton
                          title="Assign to me"
                          aria-label="edit"
                          size="small"
                          onClick={() => handleClickOpen(task)}                        >
                          <ControlPointIcon
                            fontSize="inherit"
                            className="text-grey-400 z-0 bg-gray-50 rounded"
                          />
                        </IconButton>
                      }
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleEditForm(task._id)}
                      >
                        <EditOutlined
                          fontSize="inherit"
                          className="text-green-400 z-0 bg-gray-50 rounded"
                        />
                      </IconButton>
                      {userId?.role == 'A' && <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => { setId(task?._id); setOpenDialog2(true) }}
                      >
                        <DeleteOutline
                          fontSize="inherit"
                          className="text-red-400 bg-gray-100 rounded"
                        />
                      </IconButton>}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[1, 5]}
          component="div"
          count={totalTasks}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t border-gray-200"
          sx={{
            boxShadow: "none",
            border: "none",
          }}
        />
      </TableContainer>
      <Accordian />
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Confirm Assignment</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to assign this task to yourself?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAssign} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationPopup {...{ openDialog: openDialog2, handleConfirmAssign: handleConfirmAssign2, handleClose: () => { setOpenDialog2(false) }, title: 'Confirm Task Deletion', desc: 'Are you sure you want to delete this task?' }} />

    </ThemeProvider>
  );
}
