import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import CustomFileInput from "../../components/customFile";
import moment from "moment";
import {
  getEndTasks,
  getEsiData,
  getGstData,
  getIncomeTaxData,
  getProfessionalTaxData,
  getTasks,
  providentFund,
  TDSTCS,
} from "./data";
import { base_url } from "../../const";
import TextArea from "../../components/text-area";
import { toast } from "react-toastify";
import Loader from "../../components/helpers/loader";
import CustomCheckbox from "../../components/Checkbox/Checkbox";
import ExistingCustomer from "./popups/existingCostomer";
import NewCustomer from "./popups/newCostomer";

const Taskform = ({ showForm, setShowForm, fetchTasks, companyId }) => {
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [customer, setCustomer] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
const tasks=(data)=>{
  return getTasks({companies:[], users:[],data})
}
  const endTask = getEndTasks();
  const defaultData = tasks().reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
  const [formData, setFormData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [taskData, setTasks] = useState(tasks());

  const currentYear = moment().year();
  const currentMonth = moment().format("MMMM");

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setCompanyData(null);
    setFormData((prev) => {
      const newData = { ...prev, [id]: value, pan: "" };
      if (id === "typeOfInactive") {
        newData.cancellationStatus = "";
        newData.volApplicationStatus = "";
        newData.arn = "";
        newData.arnDate = "";
        newData.applicationSubStatus = "";
        newData.dateOfApproval = "";
        newData.finalReturnStatus = "";
        newData.needToRevokeCancellation = "";
        newData.applicationStatus = "";
        newData.appealArn = "";
        newData.appealArnDate = "";
        newData.appealApplicationSubStatus = "";
        newData.goingForAppeal = "";
        newData.appealFileReturnStatus = "";
      }

      if (id === "cancellationStatus") {
        if (value !== "voluntarily") {
          newData.volApplicationStatus = "";
          newData.arn = "";
          newData.arnDate = "";
          newData.applicationSubStatus = "";
          newData.dateOfApproval = "";
          newData.finalReturnStatus = "";
          newData.appealArn = "";
          newData.appealArnDate = "";
          newData.appealApplicationSubStatus = "";
          newData.goingForAppeal = "";
          newData.appealFileReturnStatus = "";
        }
        if (value !== "suoMotu") {
          newData.needToRevokeCancellation = "";
          newData.applicationStatus = "";
          newData.arn = "";
          newData.arnDate = "";
          newData.applicationSubStatus = "";
          newData.dateOfApproval = "";
          newData.finalReturnStatus = "";
          newData.appealArn = "";
          newData.appealArnDate = "";
          newData.appealApplicationSubStatus = "";
          newData.goingForAppeal = "";
          newData.appealFileReturnStatus = "";
        }
      }

      if (id === "applicationSubStatus") {
        if (value !== "approved") {
          newData.dateOfApproval = "";
          newData.finalReturnStatus = "";
        }
      }

      if (id === "goingForAppeal") {
        if (value !== "yes") {
          newData.rejectState = "";
          newData.appealArn = "";
          newData.appealArnDate = "";
          newData.appealApplicationSubStatus = "";
          newData.dateOfApproval = "";
          newData.appealFileReturnStatus = "";
        }
      }

      return newData;
    });
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${base_url}/companies/all`);
      const data = response.data?.data.map((item) => ({
        value: item?.companyDetails?.companyName,
        label: item?.companyDetails?.companyName,
        ...item,
      }));
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/users/all`);
      const data = response.data?.data.map((item) => ({
        value: item?._id,
        label: item?.firstName,
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  // Dependency array to rerun when isChecked or company changes



  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["company", "startDate", "priority", "dueDate"]; // Updated required fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Field ${field} is required.`);
        return;
      }
    }
    setError(null);
    try {
      await axios.post(`${base_url}/tasks`, formData);
      fetchTasks();
      toast.success("Task created successfully");

      // Reset form data after submission
      setFormData({
        pan: "",
        companyName: "",
        constitution: "",
        authorizedPerson: "",
        email: "",
        mobileNumber: "",
        address: "",
        startDate: "", // Reset added fields
        priority: "",
        company: "",
        dueDate: "",
      });
      setCompanyData(null); // Clear company data
    } catch (error) {
      setError(error.message);
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    if (companyId) {
      setShowForm(true);
      const fetchTaskData = async () => {
        try {
          const response = await axios.get(`${base_url}/tasks/${companyId}`);
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

      fetchTaskData();
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

  const isDate = (value) => moment(value, moment.ISO_8601, true).isValid();

  useEffect(() => {
    if (formData?.taskType === "gst") {
      const gstData = getGstData(formData, companies);
      const gstdata = [...tasks(formData), ...gstData, ...endTask];
      setTasks(gstdata);
    } else if (formData?.taskType === "providentFund") {
      /* for PF */
      const pfData = providentFund(formData);
      const finalpfdata = [...tasks(), ...pfData, ...endTask];
      setTasks(finalpfdata);
    } else if (formData?.taskType === "tds") {
      /* for PF */
      const TdsTcsData = TDSTCS(formData);
      const finalpfdata = [...tasks(), ...TdsTcsData, ...endTask];
      setTasks(finalpfdata);
    } else if (formData?.taskType === "incomeTax") {
      /* for Income - Tax */
      const IncomeTax = getIncomeTaxData(formData);
      const IncomeTaxData = [...tasks(), ...IncomeTax, ...endTask];
      setTasks(IncomeTaxData);
    } else if (formData?.taskType === "esi") {
      /* for Income - Tax */
      const esi = getEsiData(formData);
      const GetEsiData = [...tasks(), ...esi, ...endTask];
      setTasks(GetEsiData);
    } else if (formData?.taskType === "professionalTax") {
      /* for Income - professionalTax */
      const professionalTax = getProfessionalTaxData(formData);
      const professionalTaxData = [...tasks(), ...professionalTax, ...endTask];
      setTasks(professionalTaxData);
    }
  }, [formData]);

  const getFields = (field) => {
    if (field.id === "company") {
      return companies;
    } else if (field.id === "assignedTo") {
      return [{ label: "All", value: "all" }, ...users];
    } else if (field.id === "monthlyMonth") {
      return [{ value: currentMonth, label: currentMonth }, ...field?.options];
    } else if (field.id === "year") {
      return [{ value: currentYear, label: currentYear }, ...field?.options];
    } else return field?.options;
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files[0],
    }));
  };

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      {/* {loading && loading ? (
        <>
          <div className="flex justify-center items-center  p-4">
            <Loader size={30} />{" "}
          </div>
        </>
      ) : (
        <>{"Vishnu"}</>
      )} */}

      {customer === 'Exist' && showModel && <ExistingCustomer {...{ setCustomer, setFormData, formData,setShowModel }} />}
      {customer === 'New' && showModel && <NewCustomer {...{ setCustomer, setFormData, formData,setShowModel ,fetchCompanies}}/>}

      {showForm && (
        <>
          <header
            className="text-black p-2 rounded-t-lg"
            style={{ background: "#f5f5f5" }}
          >
            <h1 className="text-2xl font-bold">Create New Task</h1>
          </header>
          <form onSubmit={handleSubmit} className="p-3">
            <div
              key={""}
              className="mb-2 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
                {"Task Form"}
              </h2>
              <div className="grid grid-cols-4 gap-5">
                <div>
                  <h4 className="text-[16px] flex-col gap-3">Customer</h4>
                  <div className="flex items-center gap-5 mt-2">
                    <CustomCheckbox
                      id="Customer"
                      label="Existing"
                      name={"customer"}
                      checked={customer == "Exist"}
                      onChange={() => { setCustomer("Exist"); setShowModel(true) }}
                      required={false}
                      className="mb-2 items-center  font-bold  justify-center"
                      style={{ cursor: "pointer" }}
                      labelStyles={{ fontSize: "16px", color: "#333" }}
                    />

                    <CustomCheckbox
                      id="newCustomer"
                      label="New"
                      name={"customer"}
                      checked={customer == "New"}
                      onChange={() => { setCustomer("New"); setShowModel(true) }}
                      required={false}
                      className="mb-2 items-center font-bold justify-center"
                      style={{ cursor: "pointer" }}
                      labelStyles={{ fontSize: "16px", color: "#333" }}
                    />
                  </div>
                </div>


                {taskData?.map((field, index) => {
                  if (field.type === "select") {
                    const value =
                      field.id === "company" && companyData
                        ? companyData.companyName // Get companyName
                        : formData[field.id] || "";

                    return (
                      <SelectInput
                        key={index}
                        id={field.id}
                        label={field.label}
                        options={getFields(field)}
                        value={value || formData[field.id]}
                        onChange={handleInputChange}
                        required={field.required}
                        defaultValue={field?.defaultValue}
                      />
                    );
                  } else if (field.type === "textarea") {
                    return (
                      <TextArea
                        key={index}
                        id={field.id}
                        label={field.label}
                        options={getFields(field)}
                        value={formData[field.id] || ""}
                        onChange={handleInputChange}
                        required={field.required}
                        defaultValue={field?.defaultValue}
                      />
                    );
                  } else if (
                    field.type === "text" ||
                    field.type === "number" ||
                    field.type === "date"
                  ) {
                    return (
                      <CustomInput
                        key={index}
                        id={field.id}
                        type={field.type}
                        label={field.label}
                        value={formData[field.id] || ""}
                        onChange={handleInputChange}
                        required={field.required}
                      />
                    );
                  } else if (field.type === "file") {
                    return (
                      <CustomFileInput
                        key={index}
                        id={field.id}
                        label={field.label}
                        link={formData[field.id]}
                        onChange={handleFileChange}
                        readOnly={field?.readOnly}
                      />
                    );
                  }
                  return null;
                })}
                <div className="col-span-4 flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 w-24 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    {loading ? (
                      <Loader color="#fff" thickness="4" />
                    ) : companyId ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Taskform;
