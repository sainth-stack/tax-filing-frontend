import React, { useState } from "react";
import { Box, Button, Input, Typography, Snackbar, Alert } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const AttachmentInput = ({ attachment, onUpload, onReUpload }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
      setSnackbarMessage("File uploaded successfully!");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("No file selected.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Attachment
      </Typography>
      {attachment ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <a href={attachment} target="_blank" rel="noopener noreferrer">
            <Button variant="contained" startIcon={<UploadFileIcon />}>
              View
            </Button>
          </a>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RemoveCircleIcon />}
            onClick={onReUpload}
          >
            Re-Upload
          </Button>
        </Box>
      ) : (
        <label htmlFor="upload-file">
          <Input
            id="upload-file"
            type="file"
            name="attachment"
            onChange={handleUpload}
            sx={{ display: "none" }}
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadFileIcon />}
            fullWidth
          >
            Upload File
          </Button>
        </label>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttachmentInput;
