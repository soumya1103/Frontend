import React from "react";
import Table from "../../Coponents/Table/Table";
import Operation from "../../Coponents/Operation/Operation";

const UserTable = ({ users, onEdit, onDelete, onAssign, onShowIssuance }) => {
  const columns = [
    { header: "Phone Number", accessor: "userCredential" },
    { header: "Name", accessor: "userName" },
    { header: "Operation", accessor: "operation" },
  ];

  const userData = users.map((user) => ({
    ...user,
    operation: (
      <Operation
        widthE="50%"
        widthD="45%"
        showExtra={true}
        isBooksPage={false}
        onClickAssignBook={() => onAssign(user)}
        onClickEdit={() => onEdit(user)}
        onClickDelete={() => onDelete(user.userId)}
        onClickUserHistory={() => onShowIssuance(user.userId)}
      />
    ),
  }));

  return <Table columns={columns} data={userData} />;
};

export default UserTable;
