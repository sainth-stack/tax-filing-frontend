import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader({ size = 35 }) {
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
        sx={{ color: "rgb(95, 70, 255)", margin: ".2rem" }}
        size={size}
      />
    </Box>
  );
}
