import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Serviceform from "../../../pages/company/Serviceform";

const ServiceModal = ({ open, onClose, currentService, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {currentService ? "Edit Service" : "Add Service"}
      </DialogTitle>
      <DialogContent>
        <Serviceform
          service={currentService}
          onSave={onSave}
          onClose={onClose}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceModal;
