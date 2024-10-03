import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { sectionsData } from "./data";
import { base_url } from "../../const";

const AgencyForm = ({
    agencyId,

    showForm,
    setAgencyId,
    setShowForm,
    agencyRefresh,
    setAgencyRefresh,
    view,
    setView,
}) => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");

    const sections = sectionsData(formData);

    // Initialize empty form data based on sections
    const initialFormData = sections.reduce((acc, section) => {
        section.fields.forEach((field) => {
            const [sectionKey, fieldKey] = field.id.split(".");
            if (!acc[sectionKey]) {
                acc[sectionKey] = {};
            }
            acc[sectionKey][fieldKey] = ""; // Set initial values to empty
        });
        return acc;
    }, {});

    useEffect(() => {
        setFormData(initialFormData); // Initialize form data on mount
    }, [agencyId]); // Only runs when agencyId changes

    // Input change handler
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

    // Form submit handler
    const handleFormSubmit = async () => {
        try {
            const cleanedFormData = { ...formData };

            const response = agencyId
                ? await axios.put(`${base_url}/agencies/${agencyId}`, cleanedFormData)
                : await axios.post(`${base_url}/agencies`, cleanedFormData);

            toast.success(agencyId ? "Agency updated successfully" : "Agency created successfully");
            setAgencyRefresh(!agencyRefresh);
            setShowForm(false);
        } catch (error) {
            console.error("Error submitting agency form:", error);
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
            setError("Error submitting agency data.");
        }
    };

    // Fetch agency data when agencyId changes
    useEffect(() => {
        const fetchAgencyData = async () => {
            if (agencyId) {
                try {
                    const response = await axios.get(`${base_url}/agencies/${agencyId}`);
                    const agencyDetails = response.data;

                    // Populate formData based on fetched agency details
                    const updatedFormData = sections.reduce((acc, section) => {
                        section.fields.forEach((field) => {
                            const [sectionKey, fieldKey] = field.id.split(".");
                            if (!acc[sectionKey]) {
                                acc[sectionKey] = {};
                            }
                            // Provide fallback for missing data
                            acc[sectionKey][fieldKey] = agencyDetails[sectionKey]?.[fieldKey] || "";
                        });
                        return acc;
                    }, {});

                    setFormData(updatedFormData); // Update formData with fetched data
                    toast.success("Agency data fetched successfully");
                } catch (error) {
                    console.error("Error fetching agency data:", error);
                    toast.error("Error fetching agency data");
                    setError("Error fetching agency data.");
                }
            }
        };

        fetchAgencyData();
    }, [agencyId]); // Only re-run when agencyId changes

    return (
        <div className="container mx-auto p-4 bg-gray rounded-lg shadow-md">
            <header className="text-black p-4 rounded-t-lg" style={{ background: "lightgrey" }}>
                <h1 className="text-2xl font-bold">
                    {agencyId ? "Edit Agency" : "Create New Agency"}
                </h1>
            </header>
            <div className="p-6">
                {/* Render form fields directly */}
                {sections.map((section) => (
                    <div key={section.title} className="flex gap-5">
                        {section.fields.map((field) => {
                            const [sectionKey, fieldKey] = field.id;
                            return (
                                <div key={field.id} className="">
                                    <label htmlFor={field.id} className="block text-sm font-medium mb-2">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[sectionKey]?.[fieldKey] || ""} // Accessing formData correctly
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder || ""}
                                        required={field.required}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div className="flex justify-end mt-2">
                    {!view && (
                        <button
                            onClick={handleFormSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {agencyId ? "Update" : "Save"}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setAgencyId("");
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

export default AgencyForm;
