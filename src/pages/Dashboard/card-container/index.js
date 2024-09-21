import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import SelectInput from "../../../components/select";

const Header = ({ children, handleExportAsCSV, handleExportAsPDF, title, type, setType, payment = false }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2
                style={{
                    textAlign: "start",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#333",
                }}
            >
                {title}
            </h2>
            <Grid style={{ display: 'flex', gap: '5px',alignItems:'center' }}>
                {payment && <SelectInput
                    id="month"
                    className="shadow-sm ml-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    default1={"Payment Type"}
                    options={[
                        { value: "all", label: "All" },
                        { value: "filing", label: "Monthly Filing" },
                        { value: "payment", label: "Monthly Payment" },
                    ]}
                    labelStyles={{ fontWeight: 500 }}
                />}
                <IconButton
                    onClick={handleMenuOpen}
                // sx={{
                //     position: "relative",
                //     left: "35rem",
                //     top: "2.5rem",
                // }}
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    anchorEl={menuAnchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleExportAsCSV}>Export as CSV</MenuItem>
                    <MenuItem onClick={handleExportAsPDF}>Export as PDF</MenuItem>
                </Menu>
            </Grid>
        </div>
    )
}

export default Header;