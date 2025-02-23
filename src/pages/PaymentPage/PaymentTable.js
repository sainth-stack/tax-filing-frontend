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
  
  handleDelete,
  setPaymentId,
  totalPayments,
  
  payments,
  page,
  pageSize,
  setPageSize,
  setPage,
  
  
  fetchPayments,
  dataLoading,
}) {

  console.log("payments lengthe", totalPayments);
  // console.log("chekign total tasks ", totalTasks, 'total page /*  */size', pageSize, "Page :", page);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sno");

  // 0 is the default starting page
  // Default rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchPayments(newPage, pageSize);
  };

 

  const handleChangeRowsPerPage = (event) => {
  const newSize = parseInt(event.target.value, 10);  // Get selected rows per page
  setPageSize(newSize);  // Set the new page size
  setPage(0);  // Reset to first page
  fetchPayments(0, newSize);  // Fetch data with updated pagination
};



  const handleRequestSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };
  const sortedPayments = Array.isArray(payments)
    ? [...payments].sort((a, b) => {
        if (!a || !b) return 0; // Handle undefined/null cases

        if (orderBy === "company") {
          const aCompany = a.company?.toLowerCase() || "";
          const bCompany = b.company?.toLowerCase() || "";
          return order === "asc"
            ? aCompany.localeCompare(bCompany)
            : bCompany.localeCompare(aCompany);
        }

        if (orderBy === "paymentType") {
          const aType = a.paymentType?.toLowerCase() || "";
          const bType = b.paymentType?.toLowerCase() || "";
          return order === "asc"
            ? aType.localeCompare(bType)
            : bType.localeCompare(aType);
        }

        if (orderBy === "amount") {
          return order === "asc"
            ? (a.amount || 0) - (b.amount || 0)
            : (b.amount || 0) - (a.amount || 0);
        }

        if (orderBy === "taskType") {
          const aNames = a.payments?.length
            ? a.payments.map((p) => p.name?.toLowerCase() || "").join(", ")
            : "";
          const bNames = b.payments?.length
            ? b.payments.map((p) => p.name?.toLowerCase() || "").join(", ")
            : "";

          return order === "asc"
            ? aNames.localeCompare(bNames)
            : bNames.localeCompare(aNames);
        }

        return 0; // Default case (no sorting)
      })
    : []; // If payments is not an array, return an empty array

  const handleEditForm = (id) => {
    // alert(id)

    setPaymentId(id);
  };

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
          aria-label="payment table"
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
                columnId="taskType"
                label="Task Type"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="paymentType"
                label="Payment Type"
                order={order}
                orderBy={orderBy}
                onSort={handleRequestSort}
              />
              <SortableTableHeader
                columnId="amount"
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
              sortedPayments.slice(page * pageSize, page * pageSize + pageSize)

              .map((payment, index) => (
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
                      onClick={() => handleEditForm(payment._id)}
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
  rowsPerPageOptions={[5,10,20]}  // Allow only 1 row per page
  component="div"
  count={totalPayments}  // Ensure this is correct
  rowsPerPage={pageSize} // Should be set to 1
  page={page}  // Current page
  onPageChange={handleChangePage}  // Update page function
  onRowsPerPageChange={handleChangeRowsPerPage}  // Update rows per page function
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
