import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader({ size = 35, color, thickness }) {
  return (
    <Box
      sx={{
        display: "flex",
        boxShadow: "1px 2px 3px  gray",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        thickness={thickness}
        sx={{ color: color ? color : "rgb(95, 70, 255)", margin: ".1em" }}
        size={size}
      />
    </Box>
  );
}
