// components/CompanyAuditTrail.js
import React, { useState, useEffect } from "react";
import { fetchAuditTrail } from "../services/auditService.js";
import { Modal, Button, Table } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CompanyAuditTrail = () => {
  const [auditData, setAuditData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        const data = await fetchAuditTrail("Company");
        setAuditData(data);
      } catch (error) {
        console.error("Error loading company audit data:", error);
      }
    };
    loadAuditData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div className="flex ">
        <Button
          onClick={handleOpen}
          variant="text"
          sx={{
            bgcolor: "teal",
            color: "white",
            marginTop: "12px",

            "&:hover": {
              bgcolor: "teal",
              color: "white",
              boxShadow: "1px 2px 3px gray",
            },
          }}
        >
          Audit History
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="audit-trail-modal"
        aria-describedby="modal-with-audit-trail"
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            margin: "100px auto",
            width: "80%",
          }}
          className="rounded-md"
        >
          <div className="flex w-full justify-center ">
            <h3 className="text-center p-4 text-xl flex  font-bold">
              Audit History for Company
            </h3>
            <span className="ml-auto">
              {" "}
              <CloseIcon className="text-3xl" onClick={handleClose} />
            </span>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>User</th>
                <th>Timestamp</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {auditData.map((audit, index) => (
                <tr key={index}>
                  <td>{audit.operation}</td>
                  <td>{audit.userId}</td>
                  <td>{new Date(audit.timestamp).toLocaleString()}</td>
                  <td>{JSON.stringify(audit.dataDocument)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyAuditTrail;
