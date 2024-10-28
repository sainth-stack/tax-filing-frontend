// Heading.js
import React from "react";
import { Typography } from "@mui/material";

const Heading = ({ text }) => {
  return (
    <Typography variant="h6" component="h2" sx={{ mb: 3, textAlign: "center" }}>
      {text}
    </Typography>
  );
};

export default Heading;
