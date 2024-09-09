// components/CompanyAuditTrail.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FetchCompanyAuditTrail from "./AuditCompanyApi.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CompanyAuditTrail = ({ setOpen, open }) => {
  const [auditData, setAuditData] = useState([]);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        const data = await FetchCompanyAuditTrail();
        console.log("data audit ui", data);
        setAuditData(data);
      } catch (error) {
        console.error("Error loading company audit data:", error);
      }
    };
    loadAuditData();
  }, []);

  return (
    <div>
      <></>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="audit-trail-modal"
        aria-describedby="modal-with-audit-trail"
      >
        <div
          style={{
            backgroundColor: "white",
            margin: "100px auto",
            width: "80%",
          }}
          className="rounded-md p-2 "
        >
          <div className="flex w-full justify-center overflow-auto rounded-md bg-slate-100 ">
            <h3 className="text-center p-2 text-md flex  font-bold capitalize">
              Audit History for Company
            </h3>
            <span className="ml-auto">
              {" "}
              <CloseIcon className="text-xl" onClick={handleClose} />
            </span>
          </div>
          <Table className="overflow-auto">
            <thead className="shadow-md border ">
              <tr className=" " style={{ padding: "1rem" }}>
                <th className="p-2">Operation</th>
                <th>User</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditData.map((audit, index) => (
                <tr key={index} className="text-center border">
                  <td>{audit.operation}</td>
                  <td>{audit.user}</td>
                  <td>{new Date(audit.timestamp).toLocaleString()}</td>
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
