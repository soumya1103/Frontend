import React from "react";
import "./Modal.css";

function Modal({ show, onClose, children, height, width }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: width, height: height }}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
