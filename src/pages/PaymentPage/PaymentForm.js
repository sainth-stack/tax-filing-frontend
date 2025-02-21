import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../const";
import SelectInput from "../../components/select";
import { PaymentStaticData } from "./PaymentData";
import CustomInput from "../../components/input";
import CustomCheckbox from "../../components/Checkbox/Checkbox";

const PaymentForm = ({ showForm, formData, setFormData }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          userId: user.role !== "A" ? user?._id : "",
          agency: user.agency,
        });

        const { data } = response?.data;

        const companyOptions = data.map((item) => ({
          label: item.companyDetails?.companyName,
          value: item.companyDetails?.companyName,
          _id: item._id,
        }));

        setCompanies(companyOptions);

        // Set initial form data
        const initialData = PaymentStaticData(companyOptions, "").reduce(
          (acc, field) => {
            acc[field.id] = field.defaultValue || "";
            return acc;
          },
          {}
        );

        setFormData(initialData);
      } catch (error) {
        setError("Failed to fetch companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle Input Change
  const handleInputChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    console.log("form data of payment",formData)
  };


 const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    setLoading(true);

    // Prepare request payload
    const payload = {
      company: formData.company, // Assuming `company` is selected from the dropdown
      taskType: formData.taskType, // Adjust if needed
      feeType: formData.feeType, // Monthly_Subscription or Lumpsum
    };

    // Extracting amounts dynamically
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("amount_") && formData[key]) {
        payload[key] = formData[key]; // Add payment amounts dynamically
      }
    });

    // Handle Lumpsum Case: Assign same amount to each selected task
    if (formData.feeType === "lumpsum") {
      const lumpsumAmount = Number(formData.lumpsumAmount) || 0;

      // Get selected tasks (task_* keys where value is true)
      const selectedTasks = Object.keys(formData)
        .filter((key) => key.startsWith("task_") && formData[key] === true)
        .map((key) => key.replace("task_", "")); // Extract actual task name

      // Generate payments array
      payload.payments = selectedTasks.map((task) => ({
        name: task,
        isChecked: true,
        amount: lumpsumAmount, // Same amount for each selected task
      }));

      // Ensure main amount also reflects lumpsum
      payload.amount = lumpsumAmount;
    }

    console.log("Submitting Payload:", payload); // Debugging

    // API Call
    const response = await axios.post(`${base_url}/payments`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Payment Response:", response.data);

    if (response.status === 201) {
      alert("Payment successfully recorded!");
      setFormData({}); // Reset form data
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
    alert("Failed to submit payment. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      {showForm && (
        <>

          <header className="p-2 text-black bg-gray-100 rounded-t-lg">
            <h1 className="text-2xl font-bold">Create New Payment</h1>
          </header>
          <form className="p-3" onSubmit={handleSubmit}>
            <div className="p-3 mb-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <div className="grid grid-cols-4 gap-4">
                {PaymentStaticData(companies, formData.feeType)?.map(
                  (field, index) => {
                    if (field.id === "taskType") {
                      return (
                        <div
                          key={index}
                          className="flex flex-col p-3 space-y-2 overflow-y-auto border rounded-md"
                        >
                          <p className="sticky top-0 p-2 mb-2 font-semibold bg-gray-200 rounded-lg shadow-sm z-5">
                            Task Type
                          </p>
                          {field.options.map((option) => (
                            <div
                              key={option.value}
                              className={`p-2 border rounded-md flex cursor-pointer text-center`}
                              onClick={() =>
                                handleInputChange("taskType", option.value)
                              }
                            >
                              <p>{option.label}</p>
                            </div>
                          ))}
                        </div>
                      );
                    } else if (field.type === "select") {
                      return (
                        <div key={index} className="">
                          <SelectInput
                            id={field.id}
                            label={field.label}
                            options={field.options}
                            value={formData[field.id] || ""}
                            onChange={(e) =>
                              handleInputChange(field.id, e.target.value)
                            }
                          />
                        </div>
                      );
                    }
                    return null; // Skip rendering for text and checkbox fields here
                  }
                )}
                <div className="">
                  {PaymentStaticData(companies, formData.feeType)?.map(
                    (field, index) => {
                      if (field.type === "text") {
                        return (
                          <div key={index} className="">
                            <CustomInput
                              id={field.id}
                              type="text"
                              label={field.label}
                              placeholder={field.placeholder}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                            />
                          </div>
                        );
                      } else if (field.type === "checkbox") {
                        return (
                          <div key={index} className="flex flex-col space-y-2">
                            <div className="flex items-center my-2 space-x-2">
                              <CustomCheckbox
                                id={field.id}
                                checked={formData[field.id] || false}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.checked)
                                }
                              />
                              <label htmlFor={field.id}>{field.label}</label>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </div>


 <div className="col-span-4 flex justify-end mt-4">
             <button
                    type="submit"
                    className={`w-40 py-2 px-2 rounded-lg ${
                      loading ? "bg-gray-400" : "bg-blue-500"
                    } text-white hover:bg-blue-600`}
                  >
                  Save
                  </button>
                  </div>
                  
              {/* Separate section for text and checkbox fields */}

              {error && <div className="mt-2 text-red-500">{error}</div>}
            </div>

   
          </form>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
