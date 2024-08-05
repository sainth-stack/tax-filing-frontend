import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Users } from "./data";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import CustomCheckbox from "../../components/Checkbox/Checkbox";
import { base_url } from "../../const";

const UserForm = ({
  setRefresh,
  refresh,
  showForm,
  setShowForm,
  fetchUsers,
  companyId,
}) => {
  const defaultData = Users[0].fields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(defaultData);
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (companyId) {
        await axios.put(
          `${base_url}/users/${companyId}`, // Adjust endpoint if needed
          formData
        );
      } else {
        await axios.post(
          `${base_url}/users`, // Adjust endpoint if needed
          formData
        );
      }

      fetchUsers();
      setShowForm(false)
      setFormData(defaultData);
    } catch (error) {
      setError(error.message);
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    // Fetch existing task data if `companyId` is provided
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/users/${companyId}`
        );
        const formattedData = mapDates(response.data);
        setFormData(formattedData);
      } catch (error) {
        setError(error.message);
        console.error(
          "ERROR",
          error.response ? error.response.data : error.message
        );
      }
    };

    if (companyId) {
      setShowForm(true);
      fetchUserData();
    }
  }, [companyId, setShowForm]);

  const mapDates = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => mapDates(item));
    } else if (data && typeof data === "object") {
      return Object.keys(data).reduce((acc, key) => {
        if (isDate(data[key])) {
          acc[key] = moment(data[key]).format("YYYY-MM-DD");
        } else {
          acc[key] = mapDates(data[key]);
        }
        return acc;
      }, {});
    }
    return data;
  };

  const isDate = (value) => {
    return moment(value, moment.ISO_8601, true).isValid();
  };

  const handleWatsappInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        "whatsappNumber": prev["mobileNumber"],
        [id]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        "whatsappNumber": "",
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  }


  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      <header
        className="text-black p-2 rounded-t-lg"
        style={{ background: "#f5f5f5" }}
      >
        <h1 className="text-2xl font-bold">Create New User</h1>
      </header>
      {showForm && (
        <form onSubmit={handleSubmit} className="p-3">
          {Users.map((user, userIndex) => (
            <div
              key={userIndex}
              className="mb-2 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
                {user.title}
              </h2>
              <div className="grid grid-cols-4 gap-5">
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
                  if (field.type === "checkbox") {
                    return (
                      <>
                        <div className="grid ">
                          <label htmlFor="">{field.text}</label>
                          <CustomCheckbox
                            key={index}
                            id={field.id}
                            label={field.label}
                            checked={formData[field.id]}
                            onChange={field.id == "sameAsWhatsappNumber" ? handleWatsappInputChange : handleInputChange}
                            required={field.required}
                          />
                        </div>
                      </>
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
            <button
              onClick={() => {
                setShowForm(false);
              }}
              className="px-4 ms-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {error && <h3 className="text-red-500">{error}</h3>}
    </div>
  );
};

export default UserForm;
