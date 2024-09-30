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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Grid, Tooltip } from "@mui/material";

import { toast } from "react-toastify";
import { base_url } from "../../const";
import SortableTableHeader from "../../components/table/SortableTableHeader";
import Loader from "../../components/helpers/loader";
import EditCompanyForm from './../company/EditCompany';
import ServiceModal from "../../components/services/models/ServiceModal";

//theme setting for table
const theme = createTheme({
    typography: {
        fontFamily: "Work Sans, Arial",
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "none",
                    padding: "12px 24px",
                    backgroundColor: "#fff",
                    "&:first-of-type": {
                        borderTopLeftRadius: "8px",
                    },
                    "&:last-of-type": {
                        borderTopRightRadius: "8px",
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

export default function AgencyTable({
    agencyId,
    setAgencyId,
    agencyRefresh,
    name,
}) {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);



    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [editModal, setEditModal] = useState(false);


    // Fetch agencies
    useEffect(() => {
        const fetchAgencies = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${base_url}/agencies/filter`, {
                    name
                });

                console.log("filter response", response)
                setAgencies(response.data);
                setLoading(false);

                const { data } = response;
                console.log("data from  in table ", data);

                const agencyDetailsArray = data.map((item) => ({
                    ...item,
                    _id: item._id,
                }));

                setAgencies(agencyDetailsArray);

                console.log("vishnu ! 0", agencyDetailsArray)
            } catch (error) {
                setLoading(false);
                console.error("Error fetching data:", error);
            }
        };

        fetchAgencies();
    }, [agencyRefresh, name]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseModal = () => {
        setEditModal(false);
    };

    const handleDelete = async (id) => {


        setLoading(true);

        try {
            await axios.delete(`${base_url}/agencies/${id}`, {

            });
            setAgencies(agencies.filter((agency) => agency._id !== id));
            toast.warn("Agency Deleted successfully");
            setLoading(false);
        } catch (error) {
            toast.warn("Failed to Delete Agency");
            console.error("Error deleting agency:", error);
        }
    };






    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <div className="mx-auto">
                {editModal && (
                    <ServiceModal open={editModal} handleClose={handleCloseModal}>
                        <EditCompanyForm
                            agencyId={agencyId}
                            onClose={handleCloseModal}
                        />
                    </ServiceModal>
                )}
            </div> */}

            <TableContainer component={Paper} className="container my-4 shadow-md rounded-lg">
                <Table sx={{ minWidth: 650 }} aria-label="agency table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="normal">
                                S.NO
                            </TableCell>

                            <SortableTableHeader
                                columnId="AgencyName"
                                label="Agency Name"
                            //order={order}
                            //orderBy={orderBy}
                            //onSort={handleRequestSort}
                            />
                            <SortableTableHeader
                                columnId="location"
                                label="Location"
                            //order={order}
                            //orderBy={orderBy}
                            //onSort={handleRequestSort}
                            />
                            <SortableTableHeader
                                columnId="EffectiveFrom"
                                label="Effective From"
                            //order={order}
                            //orderBy={orderBy}
                            //onSort={handleRequestSort}
                            />
                            <SortableTableHeader
                                columnId="DueDate"
                                label="Due Date"
                            //order={order}
                            //orderBy={orderBy}
                            //onSort={handleRequestSort}
                            />

                            <TableCell align="left" padding="normal">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow  >
                                <TableCell colSpan={6}>
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Loader />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            agencies
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((agency, index) => (
                                    <TableRow key={agency._id || index} sx={{ height: "48px" }}>
                                        <TableCell align="left" padding="normal">
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="left" padding="normal">
                                            {agency.agencyName || "N/A"}
                                        </TableCell>
                                        <TableCell align="left" padding="normal">
                                            {agency.agencyLocation || "N/A"}
                                        </TableCell>
                                        <TableCell align="left" padding="normal">
                                            {new Date(agency.effectiveEndDate).toLocaleDateString() || "N/A"}
                                        </TableCell>
                                        <TableCell align="left" padding="normal">
                                            {new Date(agency.effectiveStartDate).toLocaleDateString() || "N/A"}
                                        </TableCell>


                                        <TableCell align="left" padding="normal">

                                            <Tooltip title="Edit">
                                                <IconButton

                                                    onClick={() => {
                                                        alert("Edit");
                                                        setAgencyId(agency._id);
                                                        setEditModal(true);
                                                    }}
                                                >
                                                    <EditOutlined
                                                        className="text-green-400 z-0 bg-gray-50 rounded"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(agency._id)}>
                                                    <DeleteOutline
                                                        className="text-red-400 z-0 bg-gray-50 rounded"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={agencies.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </ThemeProvider>
    );
}
