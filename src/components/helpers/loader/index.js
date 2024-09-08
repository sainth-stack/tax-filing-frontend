import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader({ size = 35 }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress sx={{ color: "rgb(95, 70, 255)" }} size={size} />
    </Box>
  );
}
