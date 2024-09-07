// import React, { useState, useEffect } from "react";
// import Modal from "../../Coponents/Modal/Modal";
// import Input from "../../Coponents/Input/Input";
// import Button from "../../Coponents/Button/Button";
// import { updateIssuance } from "../../Api/Service/IssuanceService";
// import { getUsersByCredential } from "../../Api/Service/UserService";
// import { getBookByTitle, updateBook } from "../../Api/Service/BookService";

// function EditIssuanceModal({ show, onClose, issuance, reloadIssuances, auth, render }) {
//   const [issuanceId, setIssuanceId] = useState();
//   const [issuanceData, setIssuanceData] = useState({});
//   const [userName, setUserName] = useState("");
//   const [users, setUsers] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [originalStatus, setOriginalStatus] = useState("");

//   const [errors, setErrors] = useState({});
//   const [currentDate, setCurrentDate] = useState("");
//   const [time, setTime] = useState("");
//   const [issuanceType, setIssuanceType] = useState("");

//   const fetchData = async () => {
//     try {
//       setIssuanceData(issuance);
//       setOriginalStatus(issuance.status);

//       const booksResponse = await getBookByTitle(issuance.bookTitle, auth?.token);
//       setBooks(booksResponse.data);

//       const usersResponse = await getUsersByCredential(issuance.userCredential, auth?.token);
//       setUsers(usersResponse.data);

//       setUserName(issuance.userName || "");

//       setIssuanceId(issuance.issuanceId);
//     } catch (error) {
//       console.error("Failed to fetch users or books", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [issuance]);

//   const handleChange = (e) => {
//     setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value, userId: users.userId, bookId: books.bookId });
//   };

//   const updateBookCount = async (newStatus) => {
//     try {
//       const updatedBook = { ...books };

//       if (newStatus === "Issued" && originalStatus !== "Issued") {
//         updatedBook.bookCount = books.bookCount - 1;
//       }

//       if (newStatus === "Returned" && originalStatus === "Issued") {
//         updatedBook.bookCount = books.bookCount + 1;
//       }

//       if (updatedBook.bookCount !== books.bookCount) {
//         await updateBook(updatedBook, books.bookId, auth?.token);
//       }
//     } catch (error) {
//       console.error("Failed to update book count", error);
//     }
//   };

//   const handleUpdateIssuance = async () => {
//     try {
//       const updatePayload = {
//         userId: issuanceData.userId,
//         bookId: issuanceData.bookId,
//         returnDate: issuanceData.returnDate,
//         status: issuanceData.status,
//         issuanceType: issuanceData.issuanceType,
//       };

//       await updateBookCount(issuanceData.status);

//       await updateIssuance(updatePayload, issuanceId, auth?.token);

//       onClose();
//       reloadIssuances();
//       render();
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const modalDimensions =
//     errors.userId || errors.bookId || errors.issuanceType || errors.returnDate
//       ? { height: "550px", width: "430px" }
//       : { height: "440px", width: "400px" };
//   return (
//     <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
//       <p className="form-title">Edit Issuance</p>
//       <div>
//         <Input label="Phone No." value={issuanceData.userCredential} name="userCredential" type="text" readOnly={true} />
//         <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />
//         <Input label="Book Title" value={issuanceData.bookTitle} name="bookTitle" type="text" readOnly={true} />
//         <Input label="Issuance Type" value={issuanceData.issuanceType} name="issuanceType" type="text" readOnly={true} />
//         <Input label="Return Date" name="returnDate" type="datetime-local" onChange={handleChange} value={issuanceData.returnDate || ""} />
//         <div className="form-content">
//           <label className="form-field-label">Status</label>
//           <select className="form-field-input" name="status" onChange={handleChange} value={issuanceData.status || ""}>
//             <option value="">Select Status</option>
//             <option value="Issued">Issued</option>
//             <option value="Returned">Returned</option>
//           </select>
//         </div>
//       </div>
//       <div className="form-submit-btn">
//         <Button onClick={handleUpdateIssuance}>Update</Button>
//       </div>
//     </Modal>
//   );
// }

// export default EditIssuanceModal;
import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { updateIssuance } from "../../Api/Service/IssuanceService";
import { getUsersByCredential } from "../../Api/Service/UserService";
import { getBookByTitle, updateBook } from "../../Api/Service/BookService";
import Error from "../../Coponents/Error/Error";

function EditIssuanceModal({ show, onClose, issuance, reloadIssuances, auth, render }) {
  const [issuanceData, setIssuanceData] = useState({});
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [originalStatus, setOriginalStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [minReturnDate, setMinReturnDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIssuanceData(issuance);
        setOriginalStatus(issuance.status);

        const booksResponse = await getBookByTitle(issuance.bookTitle, auth?.token);
        setBooks(booksResponse.data);

        const usersResponse = await getUsersByCredential(issuance.userCredential, auth?.token);
        setUsers(usersResponse.data);

        setUserName(issuance.userName || "");
        setIssuanceType(issuance.issuanceType || "");

        const now = new Date();
        const dateString = now.toISOString().split("T")[0];
        const timeString = now.toTimeString().slice(0, 5);
        setCurrentDate(dateString);
        setTime(timeString);
        setMinReturnDate(`${dateString}T${timeString}`);
      } catch (error) {
        console.error("Failed to fetch users or books", error);
      }
    };
    fetchData();
  }, [issuance]);

  const validate = () => {
    const newErrors = {};
    if (!issuanceData.returnDate) newErrors.returnDate = "Return date is required.";
    if (!issuanceData.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleReturnDateChange = (e) => {
    setIssuanceData({ ...issuanceData, returnDate: e.target.value });
    setErrors((prev) => ({ ...prev, returnDate: "" }));
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);
    setIssuanceData({
      ...issuanceData,
      returnDate: `${currentDate}T${selectedTime}`,
    });
    setErrors((prev) => ({ ...prev, returnDate: "" }));
  };

  const updateBookCount = async (newStatus) => {
    try {
      const updatedBook = { ...books };

      if (newStatus === "Issued" && originalStatus !== "Issued") {
        updatedBook.bookCount = books.bookCount - 1;
      }

      if (newStatus === "Returned" && originalStatus === "Issued") {
        updatedBook.bookCount = books.bookCount + 1;
      }

      if (updatedBook.bookCount !== books.bookCount) {
        await updateBook(updatedBook, books.bookId, auth?.token);
      }
    } catch (error) {
      console.error("Failed to update book count", error);
    }
  };

  const handleUpdateIssuance = async () => {
    if (validate()) {
      try {
        const updatePayload = {
          userId: issuanceData.userId,
          bookId: issuanceData.bookId,
          returnDate: issuanceData.returnDate,
          status: issuanceData.status,
          issuanceType: issuanceData.issuanceType,
        };

        await updateBookCount(issuanceData.status);
        await updateIssuance(updatePayload, issuance.issuanceId, auth?.token);

        onClose();
        reloadIssuances();
        render();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const modalDimensions =
    errors.returnDate || errors.status
      ? { height: "520px", width: "430px" }
      : issuanceType === "Inhouse"
      ? { height: "520px", width: "400px" }
      : { height: "440px", width: "400px" };

  return (
    <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
      <p className="form-title">Edit Issuance</p>
      <div>
        <Input label="Phone No." value={issuanceData.userCredential} name="userCredential" type="text" readOnly={true} />
        <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />
        <Input label="Book Title" value={issuanceData.bookTitle} name="bookTitle" type="text" readOnly={true} />
        <Input label="Issuance Type" value={issuanceData.issuanceType} name="issuanceType" type="text" readOnly={true} />

        {issuanceType === "Inhouse" ? (
          <>
            <Input label="Return Date" value={currentDate} readOnly={true} />
            <Input label="Return Time" type="time" value={time} onChange={handleTimeChange} />
          </>
        ) : (
          <Input
            label="Return Date"
            name="returnDate"
            type="datetime-local"
            min={minReturnDate}
            value={issuanceData.returnDate || ""}
            onChange={handleReturnDateChange}
            error={errors.returnDate}
          />
        )}

        <div className="form-content">
          <label className="form-field-label">Status</label>
          <select className="form-field-input" name="status" onChange={handleChange} value={issuanceData.status || ""}>
            <option value="">Select Status</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
          </select>
          <div></div>
          {errors.status && <Error error={errors.status} />}
        </div>
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleUpdateIssuance}>Update</Button>
      </div>
    </Modal>
  );
}

export default EditIssuanceModal;
