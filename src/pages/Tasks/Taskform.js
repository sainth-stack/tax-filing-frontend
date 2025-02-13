import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import CustomFileInput from "../../components/customFile";
import moment from "moment";
import {
  getEndTasks,
  showForm,
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
import { useLocation } from "react-router";

const Taskform = ({
  showForm,
  setShowForm,
  fetchTasks,
  companyId,
  completedTaskView,
}) => {

  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [customer, setCustomer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const tasks = (data) => {
    return getTasks({ companies: [], users: [], data });
  };
  const endTask = getEndTasks();
  const user = JSON.parse(localStorage.getItem("user"));
  const defaultData = tasks().reduce((acc, field) => {
    acc[field.id] = "";
    acc["agencyName"] = user?.agency;
    return acc;
  }, {});

 const [formData, setFormData] = useState(defaultData)

  useEffect(() => {
  

    console.log("show form state",showForm)
      // Reset the completedTaskView and formData when the page is refreshed or showForm is false
      if (!showForm) {
        completedTaskView = null;
        setFormData(null); // Clear form data
        setShowForm(false); // Hide the form
      }
    

  

    // If completedTaskView exists, update formData
    if (completedTaskView && showForm) {
      setFormData((prevState) => ({
        ...prevState,
        ...completedTaskView,
      }));
    }

  }, [completedTaskView, showForm]);






  
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
      const response = await axios.post(`${base_url}/companies/filter`, {
        userId: user.role !== "A" ? user?._id : "",
        agency: user?.agency,
      });
      const data = response?.data?.data?.map((item) => ({
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
        label: item?.firstName + " " + item?.lastName,
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

   setError(null);
   setLoading(true);

   try {
     const formDataToSubmit = new FormData();
     Object.keys(formData).forEach((key) => {
       formDataToSubmit.append(key, formData[key]);
     });

     let taskResponse;
     const isUpdate = !!formData._id;

     if (isUpdate) {
       try {
         // Update existing task
         taskResponse = await axios.put(
           `${base_url}/tasks/${formData._id}`,
           formDataToSubmit
         );
         toast.success("Task Updated Successfully");
       } catch (error) {
         toast.error("Failed to Update Task");
         setLoading(false);
         return;
       }
     } else {
       try {
         // Create new task
         taskResponse = await axios.post(`${base_url}/tasks`, formDataToSubmit);
         toast.success("Task Created Successfully");
       } catch (error) {
         toast.error("Failed to Create Task");
         setLoading(false);
         return;
       }
     }

     const task = taskResponse.data.task;

     // Check if assignedTo exists and send a notification email
     if (task.assignedTo) {
       try {
         const userResponse = await axios.get(
           `${base_url}/users/${task.assignedTo}`
         );
         const assignedUser = userResponse.data;

         if (assignedUser && assignedUser.email) {
           const agency = JSON.parse(localStorage?.getItem("user"))?.agency;
           const ccAddress = JSON.parse(localStorage?.getItem("user"))?.email;


           await axios.post(`${base_url}/notifications`, {
             assignNewTask: {
               roleData: {
                 toAddress: [assignedUser.email],
                 ccAddress:[ccAddress],
                 subject: "New Task Assigned",
                 message: `Hello ${
                   assignedUser.firstName || "User"
                 }, you have been assigned a new task: "${
                   task.taskName ||task.taskType
                 }". Please check  for more details.`,
               },
             },
             agency,
           });

           console.log("Notification sent successfully.");
         } else {
           console.error("Assigned user email not found.");
         }
       } catch (error) {
         console.error("Failed to fetch assigned user details:", error);
       }
     }

     // Fetch tasks and reset the form
     fetchTasks();
     setFormData(defaultData);
     setError(null);
     setShowForm(false);
   } catch (error) {
     setError(error.message);
     console.error(
       "ERROR:",
       error.response ? error.response.data : error.message
     );
   } finally {
     setLoading(false);
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
          acc[key] = mapDates(data[key] || "");
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
      return [...users];
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

      {customer === "Exist" && showModel && (
        <ExistingCustomer
          {...{ setCustomer, setFormData, formData, setShowModel }}
        />
      )}
      {customer === "New" && showModel && (
        <NewCustomer
          {...{
            setCustomer,
            setFormData,
            formData,
            setShowModel,
            fetchCompanies,
          }}
        />
      )}

      {showForm && (
        <>
          <header
            className="text-black p-2 rounded-t-lg"
            style={{ background: "#f5f5f5" }}
          >
            <h1 className="text-2xl font-bold">
              {completedTaskView ? "View Task" : "Create New Task"}
            </h1>
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
                      disabled={completedTaskView ? true : false}
                      id="Customer"
                      label="Existing"
                      name={"customer"}
                      checked={customer == "Exist"}
                      onChange={() => {
                        setCustomer("Exist");
                        setShowModel(true);
                      }}
                      required={false}
                      className="mb-2 items-center  font-bold  justify-center"
                      style={{ cursor: "pointer" }}
                      labelStyles={{ fontSize: "16px", color: "#333" }}
                    />

                    <CustomCheckbox
                      disabled={completedTaskView ? true : false}
                      id="newCustomer"
                      label="New"
                      name={"customer"}
                      checked={customer == "New"}
                      onChange={() => {
                        setCustomer("New");
                        setShowModel(true);
                      }}
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
                        disabled={completedTaskView ? true : false}
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
                        disabled={completedTaskView ? true : false}
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
                        disabled={completedTaskView ? true : false}
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
                        disabled={completedTaskView ? true : false}
                      />
                    );
                  }
                  return null;
                })}
                <div className="col-span-4 flex justify-end mt-4">
                  <button
                    type="submit"
                    className={`w-30 py-2 px-2 rounded-lg ${
                      loading ? "bg-gray-400" : "bg-blue-500"
                    } text-white hover:bg-blue-600 ${
                      completedTaskView ? "cursor-not-allowed bg-gray-400" : ""
                    }`}
                    disabled={completedTaskView} // Disable the button if completedTaskView is available
                  >
                    {loading ? (
                      <Loader color="#fff" thickness="4" />
                    ) : completedTaskView ? (
                      "Task View" // Text when the button is disabled due to completedTaskView
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
