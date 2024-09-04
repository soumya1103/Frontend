import React from "react";
import "./Pagination.css";

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
        <button onClick={handlePrevious} className="icon" size={25}>
          Prev
        </button>
        <span>{`${currentPage + 1} of ${totalPages}`}</span>
        <button onClick={handleNext} className="icon" size={25}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
