import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";

const Header = ({ children, handleExportAsCSV, handleExportAsPDF, title }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    return (
        <div style={{ display: 'flex',justifyContent:'space-between' }}>
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
            <Grid>
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