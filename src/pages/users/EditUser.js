import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";

const EditUserForm = ({ userId, users }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    companyName: "",
    status: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch existing user data if `userId` is provided
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${userId}`
        );
        setFormData(response.data);
      } catch (error) {
        setError(error.message);
        console.error(
          "ERROR",
          error.response ? error.response.data : error.message
        );
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
        formData
      );

    } catch (error) {
      setError(error.message);
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mx-auto  bg-white rounded-lg shadow-md">
      <header
        className="text-black p-2 rounded-t-lg"
        style={{ background: "#f5f5f5" }}
      >
        <h1 className="text-2xl font-bold">Edit User</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-2 max-w-full">
        {users.map((user, userIndex) => (
          <div
            key={userIndex}
            className="mb-1 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
              {user.title}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {user.fields.map((field, index) => {
                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={index}
                      id={field.id}
                      label={field.label}
                      options={field.options}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      required={field.required}
                    />
                  );
                }
                return (
                  <CustomInput
                    key={index}
                    type={field.type}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    onChange={handleInputChange}
                    value={formData[field.id]}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </form>
      {error && <h3 className="text-red-500">{error}</h3>}
    </div>
  );
};

export default EditUserForm;
