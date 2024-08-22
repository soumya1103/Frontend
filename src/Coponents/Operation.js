import React from "react";
import editIcon from "../Images/edit-icon.svg";
import deleteIcon from "../Images/trash-icon.svg";
import "./Operation.css";

function Operation({ widthE, widthD }) {
  return (
    <div className="operation-container">
      <img src={editIcon} alt="edit" className="operation-img" width={widthE} />
      <img
        src={deleteIcon}
        alt="delete"
        className="operation-img"
        width={widthD}
      />
    </div>
  );
}

export default Operation;
