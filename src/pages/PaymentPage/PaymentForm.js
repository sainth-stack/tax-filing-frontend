import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../const";
import SelectInput from "../../components/select";
import { PaymentStaticData } from "./PaymentData";
import CustomInput from "../../components/input";
import CustomCheckbox from "../../components/Checkbox/Checkbox";
import { toast } from "react-toastify";
import Loader from "../../components/helpers/loader";

const PaymentForm = ({
  showForm,
  formData,
  setPaymentId,
  setFormData,
  setShowForm,
  paymentId,
  fetchPayments,
}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch companies and initialize form for new payment
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

        // Initialize form only for new payment (no paymentId)
        if (!paymentId) {
          const initialData = PaymentStaticData(companyOptions, "").reduce(
            (acc, field) => {
              acc[field.id] = field.defaultValue || "";
              return acc;
            },
            {}
          );
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [paymentId, setFormData]);

  // Fetch and populate payment data when paymentId exists
  useEffect(() => {
    if (!paymentId) return; // Exit if no paymentId

    setShowForm(true);

    const fetchPaymentData = async () => {
      setLoading(true); // Show loader while fetching
      try {
        // console.log("🔍 Fetching payment:", paymentId);
        const response = await axios.get(`${base_url}/payments/${paymentId}`);

         console.log("📌 Payments data at frontend:", response.data.data);
        if (response.data.data && response.data.success) {
          const payment = response.data.data;

          if (companies.length === 0) {
            console.warn("⚠️ Companies not yet loaded, retrying...");
            return; // Prevent populating incomplete data
          }

          const populatedData = {
            _id: payment._id,
            company: payment.company || "",
            taskType: payment.payments?.map((p) => p.name).join(", ") || "",
            paymentType: (payment.paymentType || "").toLowerCase(), // Normalize case
            amount: payment.amount || "", // Set amount for lumpsum
          };

          // console.log("📌 Checking payment type:", payment.paymentType);

          if (payment.payments && populatedData.paymentType === "lumpsum") {
            // console.log("✅ Lumpsum detected, processing payments...");
            populatedData.amount = payment.amount;
            payment.payments.forEach((p) => {
              populatedData[`task_${p.name}`] = p.isChecked;
              populatedData[`amount_${p.name}`] = p.amount;
            });
          } else {
            // console.log(
            //   "✅ Monthly Subscription detected, processing amounts..."
            // );
            Object.keys(payment).forEach((key) => {
              if (key.startsWith("amount_")) {
                populatedData[key] = payment[key];
              }
            });
          }

          console.log("🚀 Populating formData:", populatedData);
          setFormData(populatedData);
        } else {
          console.error("🚨 Unexpected API response:", response.data);
          setError("Unexpected API response format.");
        }
      } catch (error) {
        console.error(
          "❌ Error fetching payment data:",
          error.response?.data || error.message
        );
        setError(
          error.response?.data?.message || "Failed to fetch payment data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, setFormData, setShowForm, companies]); // Ensure companies are loaded

  // Handle Input Change
 const handleInputChange = (id, value) => {
   setFormData((prev) => {
     const updatedData = {
       ...prev,
       [id]: value,
     };

     // If the field being updated is `lumpsumAmount`, also update `amount`
     if (id === "lumpsumAmount") {
       updatedData.amount = value; // Set `amount` to `lumpsumAmount`
     }

     return updatedData;
   });

   console.log("Updated form data:", formData);
 };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null);

    const paymentId = formData._id;
    const isUpdate = !!paymentId;

    console.log("🛠 Update Mode:", isUpdate);
    console.log("🆔 Payment ID:", paymentId);

    let payload = {
      company: formData.company,
      taskType: formData.taskType,
      paymentType: formData.paymentType,
      agencyName: user?.agency,
    };

    // ✅ Add dynamic amounts
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("amount_") && formData[key]) {
        payload[key] = formData[key];
      }
    });

    // ✅ Handle Lumpsum Case
    if (formData.paymentType == "lumpsum") {
      const amount = Number(formData.amount) || 0;
      const selectedTasks = Object.keys(formData)
        .filter((key) => key.startsWith("task_") && formData[key] === true)
        .map((key) => key.replace("task_", ""));

      payload.payments = selectedTasks.map((task) => ({
        name: task,
        isChecked: true,
        amount: amount,
      }));
      payload.amount = amount;
    }

    let response;

    if (isUpdate) {
      payload.paymentId = paymentId;

      console.log("🔄 Updating payment:", paymentId);
      console.log("📤 Payload before PUT:", payload);

      try {
        response = await axios.put(
          `${base_url}/payments/${paymentId}`,
          payload
        );
        console.log("✅ Payment updated successfully:", response.data);
        toast.success("Payment Successfully Updated",{draggable:true});
      } catch (error) {
        console.error(
          "❌ Error updating payment:",
          error.response?.data || error.message
        );
        throw error;
      }
    } else {
      console.log("➕ Creating new payment:", payload);
      response = await axios.post(`${base_url}/payments`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Payment Successfully Recorded");
    }

    fetchPayments(); // ✅ Refresh payment list

    // ✅ Reset form properly after updating
    
      setFormData();
      setShowForm(false); 
      setPaymentId()// ✅ Hide form
 
  } catch (error) {
    console.error(
      "❌ Error submitting payment:",
      error.response?.data || error.message
    );
    toast.error("Failed to submit payment. Please try again.");
    setError(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      {showForm && (
        <>
          <header className="p-2 text-black bg-gray-100 rounded-t-lg">
            <h1 className="text-2xl font-bold">
              {paymentId ? "Edit Payment" : "Create New Payment"}
            </h1>
          </header>
          <form className="p-3" onSubmit={handleSubmit}>
            {loading && <Loader color="#000" thickness="4" />}{" "}
            {/* Show loader during fetch/submit */}
            {!loading && (
              <div className="p-3 mb-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                  {PaymentStaticData(companies, formData?.paymentType)?.map(
                    (field, index) => {
                      if (field.id == "taskType") {
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
                                className={`p-2 border rounded-md flex cursor-pointer text-center ${
                                  formData.taskType
                                    ?.split(", ")
                                    .includes(option.value)
                                    ? "bg-blue-100"
                                    : ""
                                }`}
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
                          <div key={index}>
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
                      return null;
                    }
                  )}
                  <div>
                    {PaymentStaticData(companies, formData.paymentType)?.map(
                      (field, index) => {
                        if (field.type === "text") {
                          return (
                            <div key={index}>
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
                            <div
                              key={index}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center my-2 space-x-2">
                                <CustomCheckbox
                                  id={field.id}
                                  checked={formData[field.id] || false}
                                  onChange={(e) =>
                                    handleInputChange(
                                      field.id,
                                      e.target.checked
                                    )
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

                <div className="flex justify-end col-span-4 mt-4">
                  <button
                    type="submit"
                    className={`w-30 py-2 px-2 rounded-lg ${
                      loading ? "bg-gray-400" : "bg-blue-500"
                    } text-white hover:bg-blue-600`}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader color="#fff" thickness="4" />
                    ) : paymentId ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>

                {error && <div className="mt-2 text-red-500">{error}</div>}
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
