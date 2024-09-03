import React from "react";
import Table from "../../Coponents/Table/Table";
import Operation from "../../Coponents/Operation/Operation";

const BookTable = ({ books, onEdit, onDelete, onAssign }) => {
  const columns = [
    { header: "Category", accessor: "categoryName" },
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
    { header: "Action", accessor: "operation" },
  ];

  const modifiedBooks = books.map((book) => ({
    ...book,
    operation: (
      <Operation
        widthE="100%"
        widthD="80%"
        showExtra={true}
        isBooksPage={true}
        onClickAssignUser={() => onAssign(book)}
        onClickEdit={() => onEdit(book)}
        onClickDelete={() => onDelete(book.bookId)}
      />
    ),
  }));

  return <Table columns={columns} data={modifiedBooks} />;
};

export default BookTable;
