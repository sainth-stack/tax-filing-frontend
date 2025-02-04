import React, { useEffect, useState } from "react";
import axios from "axios";
import { sectionsData } from "./data";
import Accordian from "../../components/Accordian";
import { base_url } from "../../const";
import { toast } from "react-toastify";
import Loader from "../../components/helpers/loader";
import {
  isEffectiveToRequired,
  isGstStateRequired,
} from "../../utils/HandleError";

const CompanyForm = ({
  companyId,
  setCompanyId,
  setShowForm,
  setCompanyRefresh,
  companyRefresh,
  view,
  setView,
}) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    companyDetails: {
      agencyName: user?.agency,
    },
  });
  const [activeState, setActiveState] = useState("");
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
    setId(id);
    const [section, field] = id.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const isFormEmpty = () => {
    return Object.values(formData).every(
      (section) =>
        section &&
        Object.values(section).every(
          (field) => field === "" || field === null || field === undefined
        )
    );
  };

  // console.log("from main componet ", activeState);
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
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. User may not be logged in.");
      return;
    }
    e.preventDefault();

    try {
      const cleanedFormData = { ...formData };

      // Validate the effectiveTo field
      const validationResult = isEffectiveToRequired(cleanedFormData);
      const validState = isGstStateRequired(cleanedFormData);

      if (!validState.isValid) {
        setError(validState.message);
        toast.error(validState.message);
        setLoading(false);
        return;
      } else {
        setError("");
      }

      if (!validationResult.isValid) {
        setError(validationResult.message);
        toast.error(validationResult.message);
        setLoading(false);
        return;
      } else {
        setError("");
      }

      if (
        cleanedFormData.companyDetails.clientStatus === "inactive" &&
        !cleanedFormData.companyDetails.effectiveTo
      ) {
        console.log(
          "Error: Effective To field is required when clientStatus is inactive"
        );
        setLoading(false);
        return;
      }

      // Ensure sections allowing duplicates are arrays
      const sectionsAllowingDuplicates = [
        //  "gst",
        //  "professionalTax",
        //  "fssai",
        //  "shopCommercialEstablishment",
        //  "factoryLicense",
      ];

      sectionsAllowingDuplicates.forEach((section) => {
        if (
          cleanedFormData[section] &&
          !Array.isArray(cleanedFormData[section])
        ) {
          cleanedFormData[section] = [cleanedFormData[section]]; // Convert to array if not already
        }
      });

      // Replace empty objects with empty strings in attachments or approvalCertificate
      Object.keys(cleanedFormData).forEach((sectionKey) => {
        if (
          sectionKey === "attachments" ||
          cleanedFormData[sectionKey]?.approvalCertificate
        ) {
          cleanedFormData[sectionKey] = replaceEmptyObjectsWithEmptyStrings(
            cleanedFormData[sectionKey]
          );
        }
      });

      // Send the cleaned data to the backend
      const response = await axios.post(
        `${base_url}/companies`,
        cleanedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle file uploads if necessary
      await handleFiles(response.data);
      setLoading(false);
      toast.success("Company created successfully");
    } catch (error) {
      setLoading(false);
      toast.error(` ${error.response?.data?.message || error.message}`);
    }
  };

  const handleFiles = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. User may not be logged in.");
      return;
    }

    try {
      const form = new FormData();
      console.log(formData);

      // 1. Append files from the "attachments" section
      for (const [key, file] of Object.entries(formData.attachments || {})) {
        if (file) {
          form.append(key, file);
        }
      }

      Object.entries(formData).forEach(([sectionKey, sectionValue]) => {
        if (
          sectionKey !== "attachments" &&
          typeof sectionValue === "object" &&
          sectionValue !== null
        ) {
          Object.entries(sectionValue).forEach(([key, value]) => {
            if (value instanceof File) {
              form.append(`${sectionKey}.${key}`, value);
            }
          });
        }
      });

      form.append("companyId", data?._id);

      const response = await axios.post(`${base_url}/files`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData(initialFormData);
      setCompanyId("");
      setView(false);
      setShowForm(false);
      setCompanyRefresh(!companyRefresh);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing. User may not be logged in.");
      // Handle the absence of the token (e.g., redirect to login)
      return;
    }

    try {
      const cleanedFormData = { ...formData , companyDetails: { ...formData.companyDetails, agencyName: user?.agency }};

      const validationResult = isEffectiveToRequired(cleanedFormData);

      if (!validationResult.isValid) {
        setError(validationResult.message);
        toast.error(validationResult.message);
        setLoading(false);
        return;
      } else {
        setError("");
      }

      if (
        cleanedFormData.companyDetails.clientStatus === "inactive" &&
        !cleanedFormData.companyDetails.effectiveTo
      ) {
        console.error(
          "Effective To field is required when clientStatus is inactive"
        );

        setLoading(false);
        return;
      }

      // Replace empty objects with empty strings in each section
      Object.keys(cleanedFormData).forEach((sectionKey) => {
        if (
          sectionKey === "attachments" ||
          cleanedFormData[sectionKey]?.approvalCertificate
        ) {
          cleanedFormData[sectionKey] = replaceEmptyObjectsWithEmptyStrings(
            cleanedFormData[sectionKey]
          );
        }
      });

      const response = await axios.put(
        `${base_url}/companies/${companyId}`,
        cleanedFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleFiles(response.data);
      setLoading(false);
      toast.success("Company updated successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error updating company");
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
        toast.error("Error while fetching company data");
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
          activeStateEffectiveDate={activeState}
          error={error}
          setExpanded={setExpanded}
          selectedId={id}
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
          {!view && !isFormEmpty() && (
            <button
              onClick={companyId ? handleUpdate : handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-24"
            >
              {loading ? (
                <Loader color="#fff" thickness="4" />
              ) : companyId ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          )}
          <button
            onClick={() => {
              setCompanyId("");
              setView(false);
              setShowForm(false);
            }}
            className="px-4 ms-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-24"
          >
            Cancel
          </button>
        </div>
        {error && <div style={{ color: "red", padding: "8px" }}>{error}</div>}
      </div>
    </div>
  );
};

export default CompanyForm;
