import "./App.css";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router";
import Pagenotfound from "./pages/Auth/Pagenotfound";
import Company from "./pages/company/Company";
import Tasks from "./pages/company/Tasks";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Pagenotfound />} />

        <Route path="/company" element={<Company />} />
      </Routes>
    </>
  );
}

export default App;
