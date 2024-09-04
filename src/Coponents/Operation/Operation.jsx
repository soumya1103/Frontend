import React from "react";
import editIcon from "../../Images/edit-icon.svg";
import deleteIcon from "../../Images/trash-icon.svg";
import assignBookIcon from "../../Images/assign-book-icon.svg";
import assignUserIcon from "../../Images/assign-user-icon.svg";
import historyIcon from "../../Images/history.svg";
import "./Operation.css";

function Operation({
  widthE,
  widthD,
  showExtra,
  isBooksPage,
  isIssuance = false,
  onClickEdit,
  onClickDelete,
  onClickAssignBook,
  onClickAssignUser,
  onClickUserHistory,
  onClickBookHistory,
}) {
  return (
    <div className="operation-container">
      <button onClick={() => onClickEdit()}>
        <img src={editIcon} alt="edit" title="Edit" className="operation-img" width={widthE} />
      </button>
      {!isIssuance && (
        <button onClick={() => onClickDelete()}>
          <img src={deleteIcon} alt="delete" title="Delete" className="operation-img" width={widthD} />
        </button>
      )}
      {showExtra && (
        <>
          <button onClick={isBooksPage ? () => onClickAssignUser() : () => onClickAssignBook()}>
            <img
              src={isBooksPage ? assignUserIcon : assignBookIcon}
              alt={isBooksPage ? "assign user" : "assign book"}
              title={isBooksPage ? "Assign User" : "Assign Book"}
              className="operation-img"
              width={widthD}
            />
          </button>
          <button onClick={isBooksPage ? () => onClickBookHistory() : () => onClickUserHistory()}>
            <img src={historyIcon} alt="history" title="History" className="operation-img" width={widthD} />
          </button>
        </>
      )}
    </div>
  );
}

export default Operation;
