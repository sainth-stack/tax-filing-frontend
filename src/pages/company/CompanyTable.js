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
import { base_url } from "../../const";
import { TableSortLabel, Tooltip } from "@mui/material";
import CompanyAuditTrail, {
  AuditBtn,
} from "../../components/AuditHistory/CompanyAuditTrail";
import Loader from "../../components/helpers/loader";
import { toast } from "react-toastify";
import Company from "./Company";
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

export default function CompanyTable({
  setCompanyId,
  companyRefresh,
  name,
  status,
  setView,
}) {

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

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
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. User may not be logged in.");
      return;
    }

    setLoading(true);

    try {
      await axios.delete(`${base_url}/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

      console.log("Fetching audit trail for document ID:", documentId);

      setLoading(true);
      const response = await axios.post(`${base_url}/audit-history`, {
        documentId,
      });

      setLoading(false);

      console.log("Response from audit-history API:", response);

      const { logs } = response.data;

      if (logs && logs.length > 0) {
        console.log("Audit logs received:", logs);
        setAuditData(logs);
        setOpen(true);
      } else {
        console.log("No audit logs found.");
        toast.warn("No audit history found for this company.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching audit trail: " + error.message);
      console.error("Error fetching audit trail:", error.message);
    }
  };

  ///sort columns
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortedCompanies = companies.sort((a, b) => {

    if (orderBy === 'companyName') {
      return (order === 'asc' ? a.companyName.localeCompare(b.companyName) : b.companyName.localeCompare(a.companyName));
    }
    if (orderBy === 'clientStatus') {
      return (order === 'asc' ? a?.clientStatus?.localeCompare(b?.clientStatus) : b?.clientStatus?.localeCompare(a?.clientStatus));
    }
    if (orderBy === 'phone') {
      return (order === 'asc' ? a?.phone?.localeCompare(b?.phone) : b?.phone?.localeCompare(a?.phone));
    }
    if (orderBy === 'mailId') {
      return (order === 'asc' ? a?.mailId?.localeCompare(b?.mailId) : b?.mailId?.localeCompare(a?.mailId));
    }
    return 0;
  });

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
                S.NO
              </TableCell>


              <SortableTableHeader
                columnId="companyName"
                label="Company Name"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="clientStatus"
                label="Status"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="phone"
                label="Mobile"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="mailId"
                label="Email Id"
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
            {loading && loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <div className="flex justify-center items-center py-4">
                    <Loader size={30} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedCompanies
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
