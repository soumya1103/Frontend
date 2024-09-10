import React from "react";
import Operation from "../../Coponents/Operation/Operation";

function CategoryOperations({ category, onEdit, onDelete }) {
  return <Operation widthE="60%" widthD="45%" onClickEdit={() => onEdit(category)} onClickDelete={() => onDelete(category.categoryId)} />;
}

export default CategoryOperations;
