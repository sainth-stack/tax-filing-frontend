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
import ServiceModal from "../../components/services/models/ServiceModal";
import EditCompanyForm from "./EditCompany";
import Accordian from "../../components/Accordian";
/* import { useParams, useResolvedPath } from "react-router-dom"; */
import { base_url } from "../../const";

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

export default function CompanyTable({
  setCompanyId,
  companyRefresh,
  name,
  status,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [companies, setCompanies] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          name,
          status,
        });
        const { data } = response;
        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          _id: item._id,
        }));
        setCompanies(companyDetailsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, [companyRefresh, name, status]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* const handleEditForm = (id) => {
    setEditCompanyId(id);
    setEditModal(true);
  }; */

  const handleCloseModal = () => {
    setEditModal(false);
    setEditCompanyId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${base_url}/companies/${id}`);
      setCompanies(companies.filter((company) => company._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="mx-auto">
        {editModal && (
          <ServiceModal open={editModal} handleClose={handleCloseModal}>
            <EditCompanyForm
              companyId={editCompanyId}
              onClose={handleCloseModal}
            />
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
                Company Name
              </TableCell>
              <TableCell align="center" padding="normal">
                Status
              </TableCell>
              <TableCell align="center" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company, index) => (
                <TableRow
                  key={company._id || index}
                  sx={{
                    height: "48px",
                  }}
                >
                  <TableCell align="center" padding="normal">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {company.companyName || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    {company.clientStatus || "N/A"}
                  </TableCell>
                  <TableCell align="center" padding="normal">
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => setCompanyId(company._id)}
                    >
                      <EditOutlined
                        fontSize="inherit"
                        className="text-green-400 animate-bounce z-0 bg-gray-50 rounded"
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDelete(company._id)}
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
          count={companies.length}
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
