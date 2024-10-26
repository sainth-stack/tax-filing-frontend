import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader({ size = 25, color, thickness, style }) {
  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        thickness={thickness}
        sx={{ color: color ? color : "rgb(95, 70, 255)" }}
        size={size}
      />
    </Box>
  );
}
