/* 
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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

const serviceOptions = ["All", "GSTN", "MSME"];
const statusOptions = ["All", "Active", "Inactive"];

function createData(
  sno,
  ServiceName,
  status,
  EffectiveFrom,
  EffectiveTo,
  Actions
) {
  return { sno, ServiceName, status, EffectiveFrom, EffectiveTo, Actions };
}

export default function ServiceTable() {
  const [rows, setRows] = useState([
    createData(1, "GSTN", "Active", "01-jan-2024", "", ""),
    createData(2, "Example Company B", "Inactive", "01-Feb-2024", "", ""),
    createData(3, "Example Company C", "Active", "01-Mar-2024", "", ""),
  ]);

  const [newServiceName, setNewServiceName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newEffectiveFrom, setNewEffectiveFrom] = useState(null);
  const [newEffectiveTo, setNewEffectiveTo] = useState(null);

  const [filterServiceName, setFilterServiceName] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterEffectiveFrom, setFilterEffectiveFrom] = useState(null);
  const [filterEffectiveTo, setFilterEffectiveTo] = useState(null);

  const handleChange = (event) => {
    setNewServiceName(event.target.value);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFilterServiceChange = (event) => {
    setFilterServiceName(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterEffectiveFromChange = (event) => {
    setFilterEffectiveFrom(event.target.value);
  };

  const handleFilterEffectiveToChange = (event) => {
    setFilterEffectiveTo(event.target.value);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      createData(
        rows.length + 1,
        newServiceName,
        newStatus,
        newEffectiveFrom,
        newEffectiveTo,
        ""
      ),
    ]);
    setNewServiceName("");
    setNewStatus("");
    setNewEffectiveFrom(null);
    setNewEffectiveTo(null);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Filter rows based on selected filters
  const filteredRows = rows.filter((row) => {
    return (
      (filterServiceName === "All" || row.ServiceName === filterServiceName) &&
      (filterStatus === "All" || row.status === filterStatus) &&
      (filterEffectiveFrom
        ? new Date(row.EffectiveFrom) >= new Date(filterEffectiveFrom)
        : true) &&
      (filterEffectiveTo
        ? new Date(row.EffectiveTo) <= new Date(filterEffectiveTo)
        : true)
    );
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" padding="normal">
                S.No
              </TableCell>
              <TableCell align="right" padding="normal">
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "120px" }} // Adjust width to fit content
                >
                  <InputLabel id="filter-service-name-label">
                    Service Name
                  </InputLabel>
                  <Select
                    labelId="filter-service-name-label"
                    id="filter-service-name"
                    value={filterServiceName}
                    label="Service Name"
                    onChange={handleFilterServiceChange}
                  >
                    {serviceOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right" padding="normal">
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "100px" }} // Adjust width to fit content
                >
                  <InputLabel id="filter-status-label">Status</InputLabel>
                  <Select
                    labelId="filter-status-label"
                    id="filter-status"
                    value={filterStatus}
                    label="Status"
                    onChange={handleFilterStatusChange}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right" padding="normal">
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filterEffectiveFrom || ""}
                  onChange={handleFilterEffectiveFromChange}
                  style={{ minWidth: "120px" }}
                />
              </TableCell>
              <TableCell align="right" padding="normal">
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filterEffectiveTo || ""}
                  onChange={handleFilterEffectiveToChange}
                  style={{ minWidth: "120px" }}
                />
              </TableCell>
              <TableCell align="right" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
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
                  {row.ServiceName}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.status}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.EffectiveFrom}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.EffectiveTo}
                </TableCell>
                <TableCell align="right" padding="normal">
                  <IconButton aria-label="edit" size="small">
                    <EditOutlined
                      fontSize="inherit"
                      className="text-green-400 bg-gray-50 rounded"
                    />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteRow(index)}
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
      </TableContainer>
      <div className="mt-4">
        <input
          type="date"
          onChange={(e) => setNewEffectiveFrom(e.target.value)}
          placeholder="Effective From"
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="date"
          onChange={(e) => setNewEffectiveTo(e.target.value)}
          placeholder="Effective To"
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <button onClick={handleAddRow} style={{ width: "100%" }}>
          Add Service
        </button>
      </div>
    </div>
  );
} */

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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const serviceOptions = ["All", "GSTN", "MSME"];
const statusOptions = ["All", "Active", "Inactive"];

function createData(
  sno,
  ServiceName,
  status,
  EffectiveFrom,
  EffectiveTo,
  Actions
) {
  return { sno, ServiceName, status, EffectiveFrom, EffectiveTo, Actions };
}

export default function ServiceTable() {
  const [rows, setRows] = useState([
    createData(1, "GSTN", "Active", "2024-01-01", "2024-12-31", ""),
    createData(
      2,
      "Example Company B",
      "Inactive",
      "2024-02-01",
      "2024-11-30",
      ""
    ),
    createData(
      3,
      "Example Company C",
      "Active",
      "2024-03-01",
      "2024-10-31",
      ""
    ),
  ]);

  const [newServiceName, setNewServiceName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newEffectiveFrom, setNewEffectiveFrom] = useState(null);
  const [newEffectiveTo, setNewEffectiveTo] = useState(null);

  const [filterServiceName, setFilterServiceName] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterEffectiveFrom, setFilterEffectiveFrom] = useState(null);
  const [filterEffectiveTo, setFilterEffectiveTo] = useState(null);

  const handleChange = (event) => {
    setNewServiceName(event.target.value);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFilterServiceChange = (event) => {
    setFilterServiceName(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterEffectiveFromChange = (event) => {
    setFilterEffectiveFrom(event.target.value);
  };

  const handleFilterEffectiveToChange = (event) => {
    setFilterEffectiveTo(event.target.value);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      createData(
        rows.length + 1,
        newServiceName,
        newStatus,
        newEffectiveFrom,
        newEffectiveTo,
        ""
      ),
    ]);
    setNewServiceName("");
    setNewStatus("");
    setNewEffectiveFrom(null);
    setNewEffectiveTo(null);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Filter rows based on selected filters
  const filteredRows = rows.filter((row) => {
    return (
      (filterServiceName === "All" || row.ServiceName === filterServiceName) &&
      (filterStatus === "All" || row.status === filterStatus) &&
      (filterEffectiveFrom
        ? new Date(row.EffectiveFrom) >= new Date(filterEffectiveFrom)
        : true) &&
      (filterEffectiveTo
        ? new Date(row.EffectiveTo) <= new Date(filterEffectiveTo)
        : true)
    );
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" padding="normal">
                S.No
              </TableCell>
              <TableCell align="right" padding="normal">
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "120px" }} // Adjust width to fit content
                >
                  <InputLabel id="filter-service-name-label">
                    Service Name
                  </InputLabel>
                  <Select
                    labelId="filter-service-name-label"
                    id="filter-service-name"
                    value={filterServiceName}
                    label="Service Name"
                    onChange={handleFilterServiceChange}
                  >
                    {serviceOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right" padding="normal">
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "100px" }} // Adjust width to fit content
                >
                  <InputLabel id="filter-status-label">Status</InputLabel>
                  <Select
                    labelId="filter-status-label"
                    id="filter-status"
                    value={filterStatus}
                    label="Status"
                    onChange={handleFilterStatusChange}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right" padding="normal">
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filterEffectiveFrom || ""}
                  onChange={handleFilterEffectiveFromChange}
                  style={{ minWidth: "120px" }}
                  label="From"
                />
              </TableCell>
              <TableCell align="right" padding="normal">
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filterEffectiveTo || ""}
                  onChange={handleFilterEffectiveToChange}
                  style={{ minWidth: "120px" }}
                  label="To"
                />
              </TableCell>
              <TableCell align="right" padding="normal">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
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
                  {row.ServiceName}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.status}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.EffectiveFrom}
                </TableCell>
                <TableCell align="right" padding="normal">
                  {row.EffectiveTo}
                </TableCell>
                <TableCell align="right" padding="normal">
                  <IconButton aria-label="edit" size="small">
                    <EditOutlined
                      fontSize="inherit"
                      className="text-green-400 bg-gray-50 rounded"
                    />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteRow(index)}
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
      </TableContainer>
    </div>
  );
}
