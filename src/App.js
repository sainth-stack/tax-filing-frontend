import "./App.css";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router";
import Pagenotfound from "./pages/Auth/Pagenotfound";
import Company from "./pages/company/Company";
import Tasks from "./pages/Tasks/Tasks";
import Users from "./pages/users/Users";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />

        <Route path="/company" element={<Company />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
