import React from "react";
import editIcon from "../../Images/edit-icon.svg";
import deleteIcon from "../../Images/trash-icon.svg";
import assignBookIcon from "../../Images/assign-book-icon.svg";
import assignUserIcon from "../../Images/assign-user-icon.svg";
import "./Operation.css";

function Operation({
  widthE,
  widthD,
  showExtra,
  isBooksPage,
  onClickEdit,
  onClickDelete,
}) {
  return (
    <div className="operation-container">
      <button onClick={() => onClickEdit()}>
        <img
          src={editIcon}
          alt="edit"
          className="operation-img"
          width={widthE}
        />
      </button>
      <button onClick={() => onClickDelete()}>
        <img
          src={deleteIcon}
          alt="delete"
          className="operation-img"
          width={widthD}
        />
      </button>
      {showExtra && (
        <button>
          <img
            src={isBooksPage ? assignUserIcon : assignBookIcon}
            alt={isBooksPage ? "assign user" : "assign book"}
            className="operation-img"
            width={widthD}
          />
        </button>
      )}
    </div>
  );
}

export default Operation;
