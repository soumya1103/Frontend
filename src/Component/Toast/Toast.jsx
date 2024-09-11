import React, { useEffect } from "react";
import "./Toast.css";
const Toast = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  return <div className={`toast ${show ? "show" : ""} ${type}`}>{message}</div>;
};
export default Toast;
