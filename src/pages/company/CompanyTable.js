import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

function createData(sno, companyName, status) {
  return { sno, companyName, status };
}

const rows = [
  createData(1, "Example Company A", "Active"),
  createData(2, "Example Company B", "Inactive"),
  createData(3, "Example Company C", "Active"),
];

export default function CompanyTable() {
  return (
    <TableContainer component={Paper} className="container ">
      <Table
        className="container table table-auto"
        size="small"
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="right" padding="normal">
              S.No
            </TableCell>
            <TableCell align="right" padding="normal">
              Company Name
            </TableCell>
            <TableCell align="right" padding="normal">
              Status
            </TableCell>
            <TableCell align="right" padding="normal">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.sno}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                height: "36px", // Adjust the height as needed
              }}
            >
              <TableCell align="right" padding="normal">
                {row.sno}
              </TableCell>
              <TableCell align="right" padding="normal">
                {row.companyName}
              </TableCell>
              <TableCell align="right" padding="normal">
                {row.status}
              </TableCell>
              <TableCell align="right" padding="normal">
                <IconButton aria-label="edit" size="small">
                  <EditOutlined
                    fontSize="inherit"
                    className="text-green-400 bg-gray-50 rounded"
                  />
                </IconButton>
                <IconButton aria-label="delete" size="small">
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
    </TableContainer>
  );
}
