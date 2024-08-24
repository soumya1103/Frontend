import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Books from "./Pages/SidebarPages/Books";
import Categories from "./Pages/SidebarPages/Categories";
import Users from "./Pages/SidebarPages/Users";
import Issuances from "./Pages/SidebarPages/Issuances";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/issuances" element={<Issuances />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
