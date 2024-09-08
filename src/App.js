import "./App.css";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router";
import Pagenotfound from "./pages/Auth/Pagenotfound";
import Company from "./pages/company/Company";
import Tasks from "./pages/Tasks/Tasks";
import Users from "./pages/users/Users";
import Toast from "./components/helpers/toast/toast";
import ToastContainer from "./components/helpers/toast/toastContainer";
import Charts from "./components/charts/Charts";
import Dashboard from "./pages/Dashboard/Dashboard";

function App({ type, message, onClose, showToast }) {
  return (
    <>
      <ToastContainer
        type={type}
        message={message}
        onClose={onClose}
        showToast={showToast}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/toast" element={<Toast />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />

        <Route path="/company" element={<Company />} />

        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
