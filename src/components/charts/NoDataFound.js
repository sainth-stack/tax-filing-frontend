import { Box, Typography } from "@mui/material";
import React from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const NoDataFound = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%", width: "100%" }}
      >
        <Typography variant="h5">
          NO DATA FOUND !
          <HelpOutlineOutlinedIcon sx={{ marginLeft: "1rem" }} />
        </Typography>
      </Box>
    </>
  );
};

export default NoDataFound;
