import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { base_url } from "../../const";
import Loader from "../../components/helpers/loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "Test@123",
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(`${base_url}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      const { token } = response.data;
      console.log("check login user", response.data);
      localStorage.setItem("token", token);

      if (token) {
        toast.success("Login successful");

        navigate("/company");
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Login Failed");

      console.error(error);
    }
  };

  useEffect(() => {
    console.log(base_url);
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        {loading ? (
          <>
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              Loading...
            </h1>
            <div className="flex justify-center items-center p-4">
              <Loader size={30} />
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={handleLogin}
              className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
            >
              <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Tax Filing
              </h1>
              <p className="text-center text-lg font-medium">
                Sign in to your account
              </p>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={formData.showPassword ? "text" : "password"}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter password"
                  />
                  <span
                    className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
                    onClick={toggleShowPassword}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex gap-5">
                <button
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Forget password
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 ms-2">
                No account?{" "}
                <Link className="underline" to="/signup">
                  Sign up
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { base_url } from "../../const";
import Loader from "../../components/helpers/loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoginJson } from "./LoginJson";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "Test@123",
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(`${base_url}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);
      const { token } = response.data;
      localStorage.setItem("token", token);

      if (token) {
        toast.success("Login successful");
        navigate("/company");
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Login Failed");
    }
  };

  useEffect(() => {
    console.log(base_url);
  }, []);

  return (
    <Container maxWidth="sm">
      {loading ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" sx={{ color: "#3b82f5" }}>
            Loading...
          </Typography>
          <Box className="flex justify-center items-center p-4">
            <Loader size={30} />
          </Box>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#3b82f5" }}
            gutterBottom
          >
            Tax Filing
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Sign in to your account
          </Typography>

          {LoginJson.map((field, index) => (
            <TextField
              key={index}
              name={field.name}
              label={field.label}
              type={
                field.name === "password" && formData.showPassword
                  ? "text"
                  : field.type
              }
              value={formData[field.name]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={
                field.name === "password"
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleShowPassword}
                          >
                            {formData.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : null
              }
            />
          ))}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mr: 1 }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ ml: 1 }}
            >
              Forget password
            </Button>
          </Box>

          <Typography align="center" variant="body2" mt={2}>
            No account?{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Login;
*/
