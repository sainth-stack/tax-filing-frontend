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
import SortableTableHeader from './../../components/table/SortableTableHeader';

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

export default function UsersTable({
  users,
  handleDelete,
  setCompanyId,
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

  const sortedUsers = users.sort((a, b) => {

    if (orderBy === 'name') {
      return order === 'asc' ? (a.firstName || '').localeCompare(b.firstName || '') : (b.firstName || '').localeCompare(a.firstName || '');
    }
    if (orderBy === 'email') {
      return order === 'asc' ? (a.email || '').localeCompare(b.email || '') : (b.email || '').localeCompare(a.email || '');
    }
    if (orderBy === 'companyName') {
      return order === 'asc' ? (a.company || '').localeCompare(b.company || '') : (b.company || '').localeCompare(a.company || '');
    }
    return 0;
  });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="mx-auto"></div>
      <TableContainer
        component={Paper}
        className="container my-4 shadow-md rounded-lg"
        sx={{ boxShadow: "none" }}
      >
        <Table
          className="table-auto"
          sx={{ minWidth: 650 }}
          aria-label="users table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left" padding="normal">
                S.NO
              </TableCell>
              <SortableTableHeader
                columnId="name"
                label="Name"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="email"
                label="Email"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="companyName"
                label="Company Name"
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
                <TableCell colSpan={5} align="center">
                  <div className="flex justify-center items-center py-4">
                    <Loader size={30} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={user._id || index} sx={{ height: "48px" }}>
                    <TableCell align="left" padding="normal">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {user.firstName + " " + user.lastName || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {user.email || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {user.company || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleEditForm(user._id)}
                      >
                        <EditOutlined
                          fontSize="inherit"
                          className="text-green-400 z-0 bg-gray-50 rounded"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDelete(user._id)}
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
          count={users.length}
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
