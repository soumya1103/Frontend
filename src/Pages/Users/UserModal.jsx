import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const UserModal = ({ show, onClose, isEdit, userData, onChange, onSubmit }) => {
  const [formData, setFormData] = useState(userData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setFormData(userData || {});
      setErrors({});
    }
  }, [show, userData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.userCredential || formData.userCredential.length !== 10) {
      newErrors.userCredential = "Phone number must be exactly 10 digits.";
    }

    if (!formData.userName || formData.userName.trim() === "") {
      newErrors.userName = "User name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    onChange(e);
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      userCredential: "",
      userName: "",
    });
    setErrors({});
  };

  const modalDimensions = errors.userCredential || errors.userName ? { height: "290px", width: "400px" } : { height: "210px", width: "400px" };

  return (
    <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
      <p className="form-title">{isEdit ? "Edit User" : "Add User"}</p>
      <div>
        <Input
          label="Phone Number"
          name="userCredential"
          value={formData.userCredential || ""}
          type="number"
          className="no-spinner"
          onChange={handleInputChange}
          maxLength={10}
          error={errors.userCredential}
        />
        <Input label="User Name" name="userName" value={formData.userName || ""} type="text" onChange={handleInputChange} error={errors.userName} />
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
};

export default UserModal;
