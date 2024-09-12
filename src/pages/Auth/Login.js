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
        )}
      </div>
    </div>
  );
};

export default Login;
