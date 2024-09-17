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
import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ServiceModal from "../../components/services/models/ServiceModal";
import EditCompanyForm from "./EditCompany";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Accordian from "../../components/Accordian";
/* import { useParams, useResolvedPath } from "react-router-dom"; */
import { base_url } from "../../const";
/* import CompanyAuditTrail from "../../components/AuditHistory/CompanyAuditTrail"; */
import { Tooltip } from "@mui/material";
import CompanyAuditTrail, {
  AuditBtn,
} from "../../components/AuditHistory/CompanyAuditTrail";
import Loader from "../../components/helpers/loader";
import { toast } from "react-toastify";
//import FetchCompanyAuditTrail from "../../components/AuditHistory/AuditCompanyApi";
import Company from "./Company";

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
  setView,
}) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [auditData, setAuditData] = useState([]);

  const [editModal, setEditModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [clientStatuses, setClientStatuses] = useState([]);
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState(0);
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          status: status === "all" ? "" : status,
          name,
        });
        setLoading(false);

        const { data } = response;

        // Extract company details and client statuses
        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          _id: item._id,
        }));

        // Extract client statuses into a separate array
        const statusesArray = companyDetailsArray.map(
          (clientStatus) => clientStatus
        );

        // Update state with company details and client statuses
        setCompanies(companyDetailsArray);
        setClientStatuses(statusesArray);

        // Log client statuses
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

  const handleCloseModal = () => {
    setEditModal(false);
    setEditCompanyId(null);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      await axios.delete(`${base_url}/companies/${id}`);
      setCompanies(companies.filter((company) => company._id !== id));
      toast.warn("Company Deleted successfully");
      setLoading(false);
    } catch (error) {
      toast.warn("Failed to  Delete Company  ");

      console.error("Error deleting company:", error);
    }
  };

  const auditHistory = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error("Document ID is required to fetch the audit trail.");
      }
      setLoading(true);

      const response = await axios.post(`${base_url}/audit-history`, {
        documentId,
      });
      setLoading(false);

      const { logs } = response.data;
      setAuditData(logs); // Updating the state with the fetched logs
      setOpen(true); // Opening the modal or component that displays audit history
    } catch (error) {
      console.error("Error fetching audit trail:", error.message);
      throw error;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {open && (
        <CompanyAuditTrail
          companyAuditData={auditData}
          handleClose={() => setOpen(false)}
        />
      )}
      <div className="mx-auto">
        {editModal && (
          <ServiceModal open={editModal} handleClose={handleCloseModal}>
            <EditCompanyForm
              clientStatuses={clientStatuses}
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
              <TableCell align="left" padding="normal">
                S.No
              </TableCell>
              <TableCell align="left" padding="normal">
                Company Name
              </TableCell>
              <TableCell align="left" padding="normal">
                Status
              </TableCell>
              <TableCell align="left" padding="normal">
                Mobile
              </TableCell>
              <TableCell align="left" padding="normal">
                Email Id
              </TableCell>
              <TableCell align="left" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <div className="flex justify-center items-center py-4">
                    <Loader size={30} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((company, index) => (
                  <TableRow key={company._id || index} sx={{ height: "48px" }}>
                    <TableCell align="left" padding="normal">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {company.companyName || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {company.clientStatus || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {company.phone || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      {company.mailId || "N/A"}
                    </TableCell>
                    <TableCell align="left" padding="normal">
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => {
                          setCompanyId(company._id);
                          setView(true);
                        }}
                      >
                        <Tooltip
                          title="View"
                          arrow
                          variant="soft"
                          placement="left"
                        >
                          <Visibility
                            fontSize="inherit"
                            className="text-green-400 z-0 bg-gray-50 rounded"
                          />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => setCompanyId(company._id)}
                      >
                        <Tooltip
                          title="Edit"
                          arrow
                          variant="soft"
                          placement="left"
                        >
                          <EditOutlined
                            fontSize="inherit"
                            className="text-green-400 z-0 bg-gray-50 rounded"
                          />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDelete(company._id)}
                      >
                        <Tooltip
                          title="Delete"
                          arrow
                          variant="soft"
                          placement="right"
                        >
                          <DeleteOutline
                            fontSize="inherit"
                            className="text-red-400 bg-gray-100 rounded"
                          />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        aria-label="audit"
                        size="small"
                        onClick={() => auditHistory(company._id)}
                      >
                        <Tooltip
                          title="Audit History"
                          arrow
                          variant="soft"
                          placement="right"
                        >
                          <MoreVertIcon />
                        </Tooltip>
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
