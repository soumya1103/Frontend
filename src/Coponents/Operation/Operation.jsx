import React from "react";
import editIcon from "../../Images/edit-icon.svg";
import deleteIcon from "../../Images/trash-icon.svg";
import assignBookIcon from "../../Images/assign-book-icon.svg";
import assignUserIcon from "../../Images/assign-user-icon.svg";
import "./Operation.css";

function Operation({ widthE, widthD, showExtra, isBooksPage }) {
  return (
    <div className="operation-container">
      <img src={editIcon} alt="edit" className="operation-img" width={widthE} />
      <img
        src={deleteIcon}
        alt="delete"
        className="operation-img"
        width={widthD}
      />
      {showExtra && (
        <img
          src={isBooksPage ? assignUserIcon : assignBookIcon}
          alt={isBooksPage ? "assign user" : "assign book"}
          className="operation-img"
          width={widthD}
        />
      )}
    </div>
  );
}

export default Operation;
