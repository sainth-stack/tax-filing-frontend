import React from "react";
import { Modal, Table } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CompanyAuditTrail = ({ companyAuditData, handleClose }) => {
  console.log("vishnu companyAuditData", companyAuditData);
  return (
    <Modal
      open={true}
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
        className="rounded-md p-2"
      >
        <div className="flex w-full justify-center overflow-auto rounded-md bg-slate-100">
          <h3 className="text-center p-2 text-md flex font-bold capitalize">
            Audit History
          </h3>
          <span className="ml-auto">
            <CloseIcon
              className="text-xl cursor-pointer"
              onClick={handleClose}
            />
          </span>
        </div>
        {companyAuditData?.length > 0 ? (
          <Table className="overflow-auto">
            <thead className="shadow-md border">
              <tr style={{ padding: "1rem" }}>
                <th className="p-2">Operation</th>
                <th>User</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {companyAuditData.map((audit, index) => (
                <tr key={index} className="text-center border">
                  <td>{audit?.operation || "N/A"}</td>
                  <td>{audit?.user || "N/A"}</td>
                  <td>
                    {new Date(audit?.timestamp).toLocaleString() || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            No Data Found
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CompanyAuditTrail;
