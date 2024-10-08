import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import CustomCheckbox from "../../components/Checkbox/Checkbox";
import { base_url } from "../../const";
import { GetUsers } from "./data";

const UserForm = ({
  setRefresh,
  refresh,
  showForm,
  setShowForm,
  fetchUsers,
  companyId,
  setCompanyId
}) => {
  const [Users, setUsers] = useState([]);
  const [Agencies, setAgencies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch companies and agencies before initializing form fields
    const fetchInitialData = async () => {
      try {
        const [companiesRes, agenciesRes] = await Promise.all([
          axios.get(`${base_url}/companies/all`),
          axios.get(`${base_url}/agencies/all`),
        ]);

        const companiesData = companiesRes.data?.data.map((item) => ({
          value: item?.companyDetails?.companyName,
          label: item?.companyDetails?.companyName,
          ...item,
        }));
        setCompanies(companiesData);

        const agenciesData = agenciesRes.data?.map((item) => ({
          value: item?.agencyName,
          label: item?.agencyName,
          ...item,
        }));
        setAgencies(agenciesData || "");

        const formFields = GetUsers(companiesData, agenciesData);
        const initialFormData = formFields.reduce((acc, field) => {
          acc[field.id] = field.defaultValue || "";
          return acc;
        }, {});
        // setFormData({...formData,...initialFormData});
        setUsers(formFields);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError(error.message);
      }
    };

    fetchInitialData();
  }, []);

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
        await axios.put(`${base_url}/users/${companyId}`, formData);
      } else {
        await axios.post(`${base_url}/users`, formData);
      }

      fetchUsers();
      setCompanyId('')
      setShowForm(false);
      setFormData({});
    } catch (error) {
      setError(error.message);
      console.error("ERROR", error.response ? error.response.data : error.message);
    }
  };

  // Fetch existing user data if `companyId` is provided
  useEffect(() => {
    const fetchUserData = async () => {
      if (companyId) {
        try {
          const response = await axios.get(`${base_url}/users/${companyId}`);
          const formattedData = mapDates(response.data);
          setFormData(formattedData);
        } catch (error) {
          setError(error.message);
          console.error("ERROR", error.response ? error.response.data : error.message);
        }
      }
    };

    if (companyId) {
      fetchUserData();
    }
  }, [companyId, setShowForm]);
  const mapDates = (data) => {
    // if (Array.isArray(data)) {
    //   return data.map((item) => mapDates(item));
    // } else if (data && typeof data === "object") {
    //   return Object.keys(data).reduce((acc, key) => {
    //     // Remove undefined or empty string properties
    //     if (key === "undefined" || data[key] === "") {
    //       return acc;
    //     }
  
    //     if (isDate(data[key])) {
    //       acc[key] = moment(data[key]).format("YYYY-MM-DD");
    //     } else {
    //       acc[key] = mapDates(data[key]);
    //     }
  
    //     return acc;
    //   }, {});
    // }
    return data;
  };
  
  const isDate = (value) => {
    return value && typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
  };

  

  const handleWhatsappInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: prev["mobileNumber"],
        [id]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: "",
        [id]: checked,
      }));
    }
  };

  console.log(formData)

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      <header className="text-black p-2 rounded-t-lg" style={{ background: "#f5f5f5" }}>
        <h1 className="text-2xl font-bold">Create New User</h1>
      </header>
      {
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
                      <div key={index} className="grid">
                        <label htmlFor={field.id}>{field.text}</label>
                        <CustomCheckbox
                          id={field.id}
                          label={field.label}
                          checked={formData[field.id]}
                          onChange={
                            field.id === "sameAsWhatsappNumber"
                              ? handleWhatsappInputChange
                              : handleInputChange
                          }
                          required={field.required}
                        />
                      </div>
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
              type="button"
              onClick={() => {setShowForm(false);setCompanyId('')}}
              className="px-4 ms-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Cancel
            </button>
          </div>
        </form>
      }
      {error && <h3 className="text-red-500">{error}</h3>}
    </div>
  );
};

export default UserForm;
