import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import { sections } from "./data";
import { base_url } from "../../const";

const EditCompanyForm = ({ companyId, onClose }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [clientStatuses, setClientStatuses] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/companies/${companyId}`
        );
        const companyDetails = response.data.companyDetails;
        console.log("Fetched company details:", companyDetails); // Log response data

        // Populate the form fields with fetched data
        const initialData = sections.reduce((acc, section) => {
          section.fields.forEach((field) => {
            acc[field.id] = companyDetails[field.id] || "";
          });
          return acc;
        }, {});
        setFormData(initialData);
        // Extract client statuses into a separate array
        const statusesArray = initialData.map(
          ({ clientStatus }) => clientStatus
        );

        console.log("stsus vishnu", statusesArray);
        // Update state with company details and client statuses
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("Error fetching company data.");
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

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
      await axios.put(`${base_url}/companies/${companyId}`, formData);
      console.log("Form submitted");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      setError("Error updating company data.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto rounded-lg shadow-md max-h-screen overflow-auto">
      <header
        className="text-black p-2 rounded-t-lg"
        style={{
          background: clientStatuses === "active" ? "red" : "#05f500",
        }}
      >
        <h1 className=" font-bold">Edit Company</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-2 max-w-full ">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-1 p-2  border border-gray-300 rounded-lg  shadow-sm"
            style={{ background: "red !important" }}
          >
            <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-3  md:grid-cols-2 lg:grid-cols-4">
              {section.fields.map((field, index) => {
                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={index}
                      id={field.id}
                      label={field.label}
                      options={field.options}
                      value={formData[field.id] || "vishnu"}
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
                    value={formData[field.id] || ""}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </div>
          </div>
        ))}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;
