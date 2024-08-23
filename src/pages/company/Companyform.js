import React, { useEffect, useState } from "react";
import axios from "axios";
import { sectionsData } from "./data";
import Accordian from "../../components/Accordian";
import { base_url } from "../../const";

const CompanyForm = ({
  clientStatuses,
  companyId,
  setCompanyId,
  setShowForm,
  setCompanyRefresh,
  companyRefresh,
  view,
  setView,
}) => {
  const [formData, setFormData] = useState({});
  const sections = sectionsData(formData);
  const [error, setError] = useState("");
  const [clientStatus, setClientStatus] = useState("");
  const [expanded, setExpanded] = useState(sections ? ["Company Details"] : []);

  const replaceEmptyObjectsWithEmptyStrings = (data) => {
    const updatedData = { ...data };
    Object.keys(updatedData).forEach((key) => {
      if (
        typeof updatedData[key] === "object" &&
        Object.keys(updatedData[key]).length === 0
      ) {
        updatedData[key] = "";
      }
    });
    return updatedData;
  };

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

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    const [section, field] = id.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: files[0],
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedFormData = { ...formData };

      // Replace empty objects with empty strings in each section
      Object.keys(cleanedFormData).forEach((sectionKey) => {
        if (sectionKey === "attachments") {
          cleanedFormData[sectionKey] = replaceEmptyObjectsWithEmptyStrings(
            cleanedFormData[sectionKey]
          );
        }
      });

      const response = await axios.post(
        `${base_url}/companies`,
        cleanedFormData
      );
      handleFiles(response.data);
    } catch (error) {}
  };

  const handleFiles = async (data) => {
    try {
      const form = new FormData();
      // Append files
      for (const [key, file] of Object.entries(formData.attachments || {})) {
        if (file) {
          form.append(key, file);
        }
      }

      form.append("companyId", data?._id);

      const response = await axios.post(`${base_url}/files`, form);
      setFormData(initialFormData);
      setCompanyId("");
      setView(false);
      setShowForm(false);
      setCompanyRefresh(!companyRefresh);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const cleanedFormData = { ...formData };

      // Replace empty objects with empty strings in each section
      Object.keys(cleanedFormData).forEach((sectionKey) => {
        if (sectionKey === "attachments") {
          cleanedFormData[sectionKey] = replaceEmptyObjectsWithEmptyStrings(
            cleanedFormData[sectionKey]
          );
        }
      });

      const response = await axios.put(
        `${base_url}/companies/${companyId}`,
        cleanedFormData
      );
      handleFiles(response.data);
    } catch (error) {
      setError("Error updating company data.");
      console.error("Error updating form:", error);
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (companyId) {
          const response = await axios.get(
            `${base_url}/companies/${companyId}`
          );
          const companyDetails = response.data;
          console.log("Fetched company details:", companyDetails);

          const initialData = sections.reduce((acc, section) => {
            section.fields.forEach((field) => {
              const [sectionKey, fieldKey] = field.id.split(".");
              if (!acc[sectionKey]) {
                acc[sectionKey] = {};
              }
              acc[sectionKey][fieldKey] =
                companyDetails[sectionKey]?.[fieldKey] || "";
            });
            return acc;
          }, {});

          setFormData(initialData);

          // Set client status
          const status = companyDetails.companyDetails.clientStatus || "";
          setClientStatus(status);
        }
      } catch (error) {
        setError("Error fetching company data.");
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);
  const handleAccordian = (title) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(title)
        ? prevExpanded.filter((t) => t !== title)
        : [...prevExpanded, title]
    );
  };

  //const sectionBackgroundColor = clientStatus === "active" ? "blue" : "red";

  return (
    <div className="container mx-auto p-4 bg-gray rounded-lg shadow-md">
      <header
        className="text-black p-4 rounded-t-lg"
        style={{
          background: "lightgrey",
        }}
      >
        <h1 className="text-2xl font-bold">
          {companyId ? "Edit Company" : "Create New Company"}
        </h1>
      </header>
      <div className="p-6 ">
        <Accordian
          companyId={companyId}
          clientStatus={clientStatus}
          view={view}
          sections={
            sections
              ? sections.map((section) => ({
                  ...section,
                  formData,
                  handleInputChange,
                  handleFileChange,
                }))
              : []
          }
          expanded={expanded}
          handleAccordian={handleAccordian}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={companyId ? handleUpdate : handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {companyId ? "View" : "Save"}
          </button>
          <button
            onClick={() => {
              setCompanyId("");
              setView(false);
              setShowForm(false);
            }}
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
