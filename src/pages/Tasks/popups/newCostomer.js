import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SelectInput from '../../../components/select';
import TextArea from '../../../components/text-area';
import CustomFileInput from '../../../components/customFile';
import CustomInput from '../../../components/input';
import { companydata } from '../data';
import { base_url } from '../../../const';
import axios from 'axios';

const NewCustomer = ({ setCustomer, setFormData, formData, setShowModel, fetchCompanies }) => {
    const [newCustomerFormData, setNewCustomerFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const field = id; // Use dot notation to split section and field

        // Update form data using setNewCustomerFormData
        setNewCustomerFormData((prev) => ({
            ...prev,
            [field]: value, // Set only the field without section prefix
        }));
    };

    const handleNewCustomerSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Token is missing. User may not be logged in.");
            setLoading(false); // Ensure loading is set to false
            return;
        }

        try {
            const response = await axios.post(
                `${base_url}/companies`,
                {companyDetails:{
                    ...newCustomerFormData
                }}, // Send the structured payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) { // Correct comparison operator
                fetchCompanies();
                setFormData({...formData,company:response?.data?.companyDetails?.companyName})
                setShowModel(false)
            }

            setLoading(false);
        } catch (error) {
            console.error("Error submitting the form:", error); // Log error if it occurs
            setLoading(false); // Ensure loading is set to false even if there's an error
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "50rem",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }}
            >
                <IconButton
                    onClick={() => setShowModel(false)}
                    style={{
                        position: "relative",
                        top: "-10px",
                        right: "-10px",
                        padding: "10px",
                        float: "right",
                        backgroundColor: "#f5f5f5",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <CloseOutlined />
                </IconButton>

                <form onSubmit={handleNewCustomerSubmit}>
                    <h2 className="text-lg font-semibold mb-4">
                        New Customer Form
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {companydata(newCustomerFormData)?.fields.map((field) => {
                            const [section, field2] = field.id.split(".")
                            const fieldId = field2;
                            // Render different components based on field type
                            const fieldComponent = (() => {
                                if (field.type === "select") {
                                    return (
                                        <SelectInput
                                            key={fieldId}
                                            id={fieldId}
                                            label={field.label}
                                            options={field.options}
                                            value={newCustomerFormData[fieldId] || ""}
                                            onChange={handleInputChange}
                                            required={field.required}
                                        />
                                    );
                                } else if (field.type === "textarea") {
                                    return (
                                        <TextArea
                                            key={fieldId}
                                            id={fieldId}
                                            label={field.label}
                                            value={newCustomerFormData[fieldId] || ""}
                                            onChange={handleInputChange}
                                            required={field.required}
                                        />
                                    );
                                } else if (field.type === "file") {
                                    return (
                                        <CustomFileInput
                                            key={fieldId}
                                            id={fieldId}
                                            label={field.label}
                                            link={newCustomerFormData[fieldId] || ""}
                                            onChange={handleInputChange}
                                            required={field.required}
                                        />
                                    );
                                } else {
                                    // Default to CustomInput for text, date, and other types
                                    return (
                                        <CustomInput
                                            key={fieldId}
                                            type={field.type}
                                            id={fieldId}
                                            label={field.label}
                                            value={newCustomerFormData[fieldId] || ""}
                                            onChange={handleInputChange}
                                            required={field.required}
                                            placeholder={field.placeholder || ""}
                                        />
                                    );
                                }
                            })();

                            return (
                                <div
                                    key={fieldId}
                                    className="w-full md:w-[calc(50%-0.5rem)]" // Width adjustment for two columns
                                >
                                    {fieldComponent}
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewCustomer;
