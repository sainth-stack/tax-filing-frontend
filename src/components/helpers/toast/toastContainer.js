/* // ToastContainer.js
import React, { useEffect } from "react";
import Toast from "./toast";

const ToastContainer = ({ toast, onClose }) => {
  const { type, message, open } = toast;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Automatically close the toast after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed top-20 p-4"
      style={{ transform: "translateX(-50%)", zIndex: 100, right: "0px" }}
    >
      <Toast message={message} onClose={onClose} type={type} showToast={open} />
    </div>
  );
};

export default ToastContainer;
 */
