import React, { useState, useEffect } from "react";
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
import ServiceModal from "./models/ServiceModal";
import EditServiceform from "./../../pages/company/EditServiceform ";

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

export default function ServiceTable({ refresh }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://13.229.92.87:4500/api/services");
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refresh]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditForm = (id) => {
    setEditServiceId(id);
    setEditModal(true);
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setEditServiceId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://13.229.92.87:4500/api/services/${id}`);
      setRows(rows.filter((row) => row._id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className="mx-auto">
        {editModal && (
          <ServiceModal open={editModal} handleClose={handleCloseModal}>
            <EditServiceform serviceId={editServiceId} />
          </ServiceModal>
        )}
      </div>
      <TableContainer
        component={Paper}
        className="container my-4 shadow-md rounded-lg"
        sx={{ boxShadow: "none" }}
      >
        <Table
          className="table-auto"
          sx={{ minWidth: 650 }}
          aria-label="company table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" padding="normal">
                S.No
              </TableCell>
              <TableCell align="center" padding="normal">
                Service Name
              </TableCell>
              <TableCell align="center" padding="normal">
                Status
              </TableCell>
              <TableCell align="center" padding="normal">
                Effective From
              </TableCell>
              <TableCell align="center" padding="normal">
                Effective To
              </TableCell>
              <TableCell align="center" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={row._id || index}
                  sx={{
                    height: "48px",
                  }}
                >
                  <TableCell align="center" padding="normal">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {row.serviceName}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {row.status}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {new Date(row.effectiveFrom).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {new Date(row.effectiveTo).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    <IconButton
                      aria-label="edit"
                      className="-z-0"
                      size="small"
                      onClick={() => handleEditForm(row._id)}
                    >
                      <EditOutlined
                        fontSize="inherit"
                        className="text-green-400 animate-bounce  z-0 bg-gray-50 rounded"
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDelete(row._id)}
                    >
                      <DeleteOutline
                        fontSize="inherit"
                        className="text-red-400 animate-bounce bg-gray-100 rounded"
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
          count={rows.length}
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
    </ThemeProvider>
  );
}
