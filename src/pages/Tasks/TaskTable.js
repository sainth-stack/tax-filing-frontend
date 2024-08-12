import React, { useState } from "react";
import axios from "axios";
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
}) {
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
              <TableCell align="center" padding="normal">
                S.No
              </TableCell>
              <TableCell align="center" padding="normal">
                Company
              </TableCell>
              <TableCell align="center" padding="normal">
                Task Name
              </TableCell>
              <TableCell align="center" padding="normal">
                Due Date
              </TableCell>
              <TableCell align="center" padding="normal">
                Status
              </TableCell>
              <TableCell align="center" padding="normal">
                Assigned To
              </TableCell>
              <TableCell align="center" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task, index) => (
                <TableRow key={task._id || index} sx={{ height: "48px" }}>
                  <TableCell align="center" padding="normal">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {task.company || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {task.taskName || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {new Date(task.dueDate).toLocaleDateString() || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {task.applicationStatus || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {task.assignedTo || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
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
              ))}
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
