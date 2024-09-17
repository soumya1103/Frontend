import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Books from "./Pages/Books/Books";
import Categories from "./Pages/Categories/Categories";
import Users from "./Pages/Users/Users";
import Issuances from "./Pages/Issuances/Issuances";
import UserHistory from "./Pages/UserHistory/UserHistory";
import AdminRoute from "./Component/Redirect/AdminRoute";
import UserRoute from "./Component/Redirect/UserRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./Api/Service/Login";
import { loginUser } from "./Redux/Authentication/AuthenticationAction";
import BookIssuanceHistory from "./Pages/Books/BookIssuanceHistory";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = window.localStorage.getItem("authtoken");

    if (token) {
      loadUser(token);
    } else {
      navigate("/login");
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const { data } = await getCurrentUser(token);
      dispatch(loginUser(data));
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/books"
          element={
            <AdminRoute>
              <Books />
            </AdminRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminRoute>
              <Categories />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/bookIssuanceHistory"
          element={
            <AdminRoute>
              <BookIssuanceHistory />
            </AdminRoute>
          }
        />
        <Route
          path="/issuances"
          element={
            <AdminRoute>
              <Issuances />
            </AdminRoute>
          }
        />
        <Route
          path="/userHistory"
          element={
            <UserRoute>
              <UserHistory />
            </UserRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
