import React, { useEffect } from "react";
import Toast from "./toast";

const ToastContainer = ({ type, message, onClose, showToast }) => {
  console.log("toast container", type, message, onClose);
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Toast
        message={message}
        onClose={onClose}
        type={type}
        showToast={showToast}
      />
    </div>
  );
};

export default ToastContainer;
