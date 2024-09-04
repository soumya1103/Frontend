import React from "react";
import "./Table.css";
import Pagination from "../Pagination/Pagination";

const Table = ({ show = false, columns, data, onPageChange, currentPage, totalPages }) => {
  return (
    <>
      <table className="table-container">
        <thead>
          <tr>
            {/* <th>S.No</th> */}
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* <td>{rowIndex + 1}</td> */}
              {columns.map((column) => (
                <td key={column.accessor}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {show && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
    </>
  );
};

export default Table;
