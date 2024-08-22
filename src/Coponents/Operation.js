import React from "react";
import editIcon from "../Images/edit-icon.svg";
import deleteIcon from "../Images/trash-icon.svg";
import "./Operation.css";

function Operation() {
  return (
    <div className="operation-container">
      <img src={editIcon} alt="edit" className="operation-img" width="8%" />
      <img
        src={deleteIcon}
        alt="delete"
        className="operation-img"
        width="6.5%"
      />
    </div>
  );
}

export default Operation;
