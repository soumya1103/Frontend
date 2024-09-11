import React from "react";
import Modal from "../../Component/Modal/Modal";
import Button from "../../Component/Button/Button";
import "./ConfirmationModal.css";

function ConfirmationModal({ show, onClose, onConfirm, isLogout = false }) {
  return (
    <Modal show={show} onClose={onClose} height="120px" width="300px">
      <div className="confirmation-modal-content">
        {isLogout ? <p>Are you sure you want to logout?</p> : <p>Are you sure you want to delete?</p>}
        <div className="confirmation-modal-actions">
          <Button onClick={onConfirm}>Yes</Button>
          <Button onClick={onClose}>No</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
