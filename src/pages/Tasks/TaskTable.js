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

import Accordian from "../../components/Accordian";
import Loader from "../../components/helpers/loader";
import SortableTableHeader from "../../components/table/SortableTableHeader";

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

export default function TasksTable({
  tasks,
  handleDelete,
  setCompanyId,
  formData,
  dataLoading,
}) {

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('sno'); // default sorting by S.No


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditForm = (id) => {
    setCompanyId(id);
  };

  const handleRequestSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };


  const sortedTasks = tasks.sort((a, b) => {

    if (orderBy === 'company') {
      return order === 'asc'
        ? (a.company || '').localeCompare(b.company || '')
        : (b.company || '').localeCompare(a.company || '');
    }
    if (orderBy === 'taskName') {
      return order === 'asc'
        ? (a.taskName || '').localeCompare(b.taskName || '')
        : (b.taskName || '').localeCompare(a.taskName || '');
    }
    if (orderBy === 'dueDate') {
      return order === 'asc' ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (orderBy === 'status') {
      return order === 'asc'
        ? (a.applicationStatus || '').localeCompare(b.applicationStatus || '')
        : (b.applicationStatus || '').localeCompare(a.applicationStatus || '');
    }
    if (orderBy === 'assignedTo') {
      return order === 'asc'
        ? (a.assignedTo || '').localeCompare(b.assignedTo || '')
        : (b.assignedTo || '').localeCompare(a.assignedTo || '');
    }
    if (orderBy === 'applicationSubStatus') {
      return order === 'asc'
        ? (a.applicationSubStatus || '').localeCompare(b.applicationSubStatus || '')
        : (b.applicationSubStatus || '').localeCompare(a.applicationSubStatus || '');
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
              <SortableTableHeader columnId="company" label="Company" order={order} orderBy={orderBy} onSort={handleRequestSort} />
              <SortableTableHeader columnId="taskName" label="Task Name" order={order} orderBy={orderBy} onSort={handleRequestSort} />
              <SortableTableHeader columnId="dueDate" label="Due Date" order={order} orderBy={orderBy} onSort={handleRequestSort} />
              <SortableTableHeader columnId="status" label="Status" order={order} orderBy={orderBy} onSort={handleRequestSort} />
              <SortableTableHeader columnId="assignedTo" label="Assigned To" order={order} orderBy={orderBy} onSort={handleRequestSort} />
              <SortableTableHeader columnId="applicationSubStatus" label="Application Sub Status" order={order} orderBy={orderBy} onSort={handleRequestSort} />

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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task, index) => (
                  <TableRow key={task._id || index} sx={{ height: "48px" }}>
                    <TableCell align="left" padding="normal">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.company || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.taskName || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {new Date(task.dueDate).toLocaleDateString() || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.applicationStatus || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.assignedTo || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {task.applicationSubStatus || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
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
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDelete(task._id)}
                      >
                        <DeleteOutline
                          fontSize="inherit"
                          className="text-red-400 bg-gray-100 rounded"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
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
    </ThemeProvider>
  );
}
