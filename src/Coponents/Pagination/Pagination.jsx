import React from "react";
import "./Pagination.css";
import Button from "../Button/Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage >= 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage + 1 < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination">
        <Button onClick={handlePrevious} className="pagination-icon-left icon" size={25}>
          Prev
        </Button>

        <span>{`${currentPage + 1} of ${totalPages}`}</span>
        <Button onClick={handleNext} className="pagination-icon-right icon" size={25}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
