import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import { sections } from "./data";

const CompanyForm = ({ companyId, setCompanyId, setShowForm,setCompanyRefresh ,companyRefresh }) => {
  const [error, setError] = useState("");

  const initialFormData = sections.reduce((acc, section) => {
    section.fields.forEach((field) => {
      const [sectionKey, fieldKey] = field.id.split(".");
      if (!acc[sectionKey]) {
        acc[sectionKey] = {};
      }
      acc[sectionKey][fieldKey] = "";
    });
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const [section, field] = id.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/companies",
        formData
      );
      console.log("Form submitted:", response.data);
      // Optionally, reset the form after successful submission
      setFormData(initialFormData);
      setCompanyId("")
      setShowForm(false)
      setCompanyRefresh(!companyRefresh)
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const handleupdate = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/companies/${companyId}`,
        formData
      );
      console.log("Form submitted");
      setCompanyId("")
      setShowForm(false)
      setCompanyRefresh(!companyRefresh)
    } catch (error) {
      setError("Error updating company data.");
      console.error("Error submitting form:", error);
    }
  };



  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (companyId) {
          const response = await axios.get(
            `http://localhost:4000/api/companies/${companyId}`
          );
          const companyDetails = response.data;
          console.log("Fetched company details:", companyDetails);

          // Populate the form fields with fetched data
          const initialData = sections.reduce((acc, section) => {
            section.fields.forEach((field) => {
              const [sectionKey, fieldKey] = field.id.split(".");
              if (!acc[sectionKey]) {
                acc[sectionKey] = {};
              }
              acc[sectionKey][fieldKey] = companyDetails[sectionKey]?.[fieldKey] || "";
            });
            return acc;
          }, {});

          setFormData(initialData);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("Error fetching company data.");
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <header
        className="text-black p-4 rounded-t-lg"
        style={{ background: "#f5f5f5" }}
      >
        <h1 className="text-2xl font-bold">{companyId ? "Edit Company" : "Create New Company"}</h1>
      </header>
      <div className="p-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {section.fields.map((field, index) => {
                const fieldId = field.id;
                const [sectionKey, fieldKey] = fieldId.split(".");
                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={index}
                      id={fieldId}
                      label={field.label}
                      options={field.options}
                      value={formData[sectionKey]?.[fieldKey] || ""}
                      onChange={handleInputChange}
                      required={field.required}
                    />
                  );
                }
                return (
                  <CustomInput
                    key={index}
                    type={field.type}
                    id={fieldId}
                    label={field.label}
                    required={field.required}
                    onChange={handleInputChange}
                    value={formData[sectionKey]?.[fieldKey] || ""}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            onClick={() => companyId ? handleupdate() : handleSubmit()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {companyId ? "Update" : "Save"}
          </button>
          <button
            onClick={() => { setCompanyId(""); setShowForm(false) }}
            className="px-4 ms-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
