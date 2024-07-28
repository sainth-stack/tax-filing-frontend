import "./App.css";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router";
import Pagenotfound from "./pages/Auth/Pagenotfound";
import Company from "./pages/company/Company";

function App() {
  return (
    <>
      <h1>{process.env.test_env}</h1>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Pagenotfound />} />

        <Route path="/company" element={<Company />} />
      </Routes>
    </>
  );
}

export default App;
