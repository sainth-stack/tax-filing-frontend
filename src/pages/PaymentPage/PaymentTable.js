import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import { DeleteOutline, EditOutlined, Payments } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import moment from "moment";

import Accordian from "../../components/Accordian";
import Loader from "../../components/helpers/loader";
import SortableTableHeader from "../../components/table/SortableTableHeader";
import { paymentTaskTypeMap } from "../../utils/TaskTypeMap";
import { toast } from "react-toastify";

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

export default function PaymentTable({
  tasks,
  handleDelete,
  setCompanyId,
  formData,
  setFormData,
  payments,
  page,
  pageSize,
  setPageSize,
  setPage,
  totalTasks,
  fetchAllTasks,
  dataLoading,
}) {

  console.log("payment datiles from table",payments)
  // console.log("chekign total tasks ", totalTasks, 'total page /*  */size', pageSize, "Page :", page);
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
const sortedPayments = payments.sort((a, b) => {
  if (orderBy === "company") {
    // If you have a company name, use it; otherwise, fallback to companyId
    const aCompany = a.company || a.companyId || "";
    const bCompany = b.company || b.companyId || "";
    return order === "asc"
      ? aCompany.localeCompare(bCompany)
      : bCompany.localeCompare(aCompany);
  }
  if (orderBy === "paymentType") {
    return order === "asc"
      ? (a.paymentType || "").localeCompare(b.paymentType || "")
      : (b.paymentType || "").localeCompare(a.paymentType || "");
  }
  if (orderBy === "amount") {
    return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
  }
  if (orderBy === "paymentName") {
    // Sort by the name of the first payment inside the payments array
    const aName = a.payments && a.payments.length > 0 ? a.payments[0].name : "";
    const bName = b.payments && b.payments.length > 0 ? b.payments[0].name : "";
    return order === "asc"
      ? aName.localeCompare(bName)
      : bName.localeCompare(aName);
  }
  return 0; // Default, no sorting
});


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TableContainer
        component={Paper}
        className="container my-4 rounded-lg shadow-md"
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
                label="Task Type"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="dueDate"
                label="Fee Type"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="status"
                label="Amount"
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
                  <div className="flex items-center justify-center py-4">
                    <Loader size={30} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedPayments.map((payment, index) => (
                <TableRow key={payment._id || index} sx={{ height: "48px" }}>
                  <TableCell align="left" padding="normal">
                    {page * pageSize + index + 1}
                  </TableCell>
                  <TableCell align="left" padding="normal">
                    {payment.company || "N/A"}
                  </TableCell>
                  <TableCell
                    align="left"
                    padding="normal"
                    sx={{
                      maxWidth: "2rem",
                    }}
                  >
                    {payment.payments
                      ?.map((p) => paymentTaskTypeMap[p.name] || p.name) // Replace with mapped value if exists
                      .join(", ") || "N/A"}
                  </TableCell>

                  <TableCell align="left" padding="normal">
                    {payment.paymentType || "N/A"}
                  </TableCell>

                  <TableCell align="left" padding="normal">
                    {payment.amount
                      ? `₹${payment.amount.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  {/* <TableCell align="left" padding="normal">
                    {payment.payments.length > 0
                      ? payment.payments
                          .map(
                            (p) => `${p.name} (₹${p.amount.toLocaleString()})`
                          )
                          .join(", ")
                      : "No Payments"}
                  </TableCell> */}
                  <TableCell align="left" padding="normal">
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() =>
                         {
                           toast.info("Edit will be updated Soooon.........",{position:"top-center",draggable:true});
                           // handleEditForm(payment._id)}
                         }
                        
                      }
                    >
                      <EditOutlined
                        fontSize="inherit"
                        className="z-0 text-green-400 rounded bg-gray-50"
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDelete(payment._id)}
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
          rowsPerPageOptions={[5, 10, 20]} // Options for rows per page
          component="div"
          count={payments?.length} // Total number of payments
          rowsPerPage={pageSize} // Selected number of rows per page
          page={page} // Current page
          onPageChange={handleChangePage} // Function to update page
          onRowsPerPageChange={handleChangeRowsPerPage} // Function to update rows per page
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
