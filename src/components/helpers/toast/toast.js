/* // Toast.js
import React from "react";
import tick from "../../../assests/images/tick.svg";
import warning from "../../../assests/images/warning.svg";
import CloseIcon from "@mui/icons-material/Close";

const Toast = ({ type, message, onClose }) => {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        gap: "16px",
        background: type === "success" ? "#3ABC4F" : "#EC524A",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <img
        src={type === "success" ? tick : warning}
        alt={type === "success" ? "success" : "warning"}
        width={24}
        height={24}
      />
      <div
        style={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "18.77px",
          color: "white",
          width: "220px",
        }}
      >
        {message}
      </div>
      <button onClick={onClose} style={{ marginLeft: "10px", color: "white" }}>
        <CloseIcon />
      </button>
    </div>
  );
};

export default Toast;
 */
