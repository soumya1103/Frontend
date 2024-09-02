import React from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const UserModal = ({ show, onClose, isEdit, userData, onChange, onSubmit }) => {
  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;
    if (name === "userCredential" && value.length > 10) {
      return;
    }
    onChange(e);
  };

  return (
    <Modal show={show} onClose={onClose} height={isEdit ? "210px" : "250px"} width="400px">
      <p className="form-title">{isEdit ? "Edit User" : "Add User"}</p>
      <div className="form-content">
        <Input
          label="Phone Number"
          name="userCredential"
          value={userData.userCredential}
          type="number"
          className="no-spinner"
          onChange={handlePhoneNumberChange}
          maxLength={10}
        />
        <Input label="User Name" name="userName" value={userData.userName} type="text" onChange={onChange} />
        {isEdit ? "" : <Input label="Password" name="password" value={userData.password} type="text" onChange={onChange} />}
      </div>
      <div className="form-submit-btn">
        <Button onClick={onSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
};

export default UserModal;
