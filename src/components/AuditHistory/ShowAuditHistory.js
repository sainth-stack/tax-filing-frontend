import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import wrong from "assets/svg/wrong.svg";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function ShowAuditHistory({ show, onHide }) {
  const { t } = useTranslation();
  const [auditData, setAuditData] = useState([]);

  // Fetch audit history data when modal is shown
  useEffect(() => {
    if (show) {
      const fetchAuditData = async () => {
        try {
          const response = await axios.get("/api/audit/companies"); // Adjust the endpoint as per your backend
          setAuditData(response.data);
        } catch (error) {
          console.error("Error fetching audit history:", error);
        }
      };
      fetchAuditData();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          background: "#F5F5F6",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.17)",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ paddingTop: "10px", paddingLeft: "20px" }}
        >
          {t("OKR Details.Audit History")}
        </Modal.Title>
        <img
          src={wrong}
          alt="Close"
          onClick={onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <Table hover>
          <thead>
            <tr>
              <th>{t("OKR Details.Operation")}</th>
              <th>{t("OKR Details.Action By")}</th>
              <th>{t("OKR Details.Updated Time")}</th>
            </tr>
          </thead>
          <tbody>
            {auditData.length > 0 ? (
              auditData.map((audit) => (
                <tr key={audit._id}>
                  <td>{audit.operation}</td>
                  <td>{audit.userName}</td>
                  <td>
                    {new Date(audit.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  {t("OKR Details.No Audit History Available")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
