import React from "react";
import "./Table.css";
import Pagination from "../Pagination/Pagination";

const Table = ({ show = false, columns, data, onPageChange, currentPage, totalPages }) => {
  return (
    <>
      <div className="table-container-wrapper">
        <table className="table-container">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column.accessor}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
    </>
  );
};

export default Table;
