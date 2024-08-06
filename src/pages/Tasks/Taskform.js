import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import moment from "moment";
import { getGstData, getGstMonthlyData, getTasks, gst } from "./data";
import { base_url } from "../../const";

const Taskform = ({
  setRefresh,
  refresh,
  showForm,
  setShowForm,
  fetchTasks,
  companyId,
}) => {
  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])

  const tasks = getTasks([], [])

  const defaultData = tasks.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
  const [formData, setFormData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [taskData, setTasks] = useState(tasks)
  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [id]: value };

      // Reset fields based on the updated value
      if (id === 'typeOfInactive') {
        // Reset fields related to typeOfInactive
        newData.cancellationStatus = '';
        newData.volApplicationStatus = '';
        newData.arn = '';
        newData.arnDate = '';
        newData.applicationSubStatus = '';
        newData.dateOfApproval = '';
        newData.finalReturnStatus = '';
        newData.needToRevokeCancellation = '';
        newData.applicationStatus = '';
        newData.appealArn = '';
        newData.appealArnDate = '';
        newData.appealApplicationSubStatus = '';
        newData.goingForAppeal = '';
        newData.appealFileReturnStatus = '';
      }

      if (id === 'cancellationStatus') {
        // Reset fields related to cancellationStatus
        if (value !== 'voluntarily') {
          newData.volApplicationStatus = '';
          newData.arn = '';
          newData.arnDate = '';
          newData.applicationSubStatus = '';
          newData.dateOfApproval = '';
          newData.finalReturnStatus = '';
          newData.appealArn = '';
          newData.appealArnDate = '';
          newData.appealApplicationSubStatus = '';
          newData.goingForAppeal = '';
          newData.appealFileReturnStatus = '';
        }
        if (value !== 'suoMotu') {
          newData.needToRevokeCancellation = '';
          newData.applicationStatus = '';
          newData.arn = '';
          newData.arnDate = '';
          newData.applicationSubStatus = '';
          newData.dateOfApproval = '';
          newData.finalReturnStatus = '';
          newData.appealArn = '';
          newData.appealArnDate = '';
          newData.appealApplicationSubStatus = '';
          newData.goingForAppeal = '';
          newData.appealFileReturnStatus = '';
        }
      }

      if (id === 'applicationSubStatus') {
        // Reset fields related to applicationSubStatus
        if (value !== 'approved') {
          newData.dateOfApproval = '';
          newData.finalReturnStatus = '';
        }
      }

      if (id === 'goingForAppeal') {
        // Reset fields related to goingForAppeal
        if (value !== 'yes') {
          newData.rejectState = '';
          newData.appealArn = '';
          newData.appealArnDate = '';
          newData.appealApplicationSubStatus = '';
          newData.dateOfApproval = '';
          newData.appealFileReturnStatus = '';
        }
      }

      return newData;
    });
  };


  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${base_url}/companies/all`);
      const data = response.data?.data.map((item) => {
        return {
          value: item?.companyDetails?.companyName, label: item?.companyDetails?.companyName
        }
      })
      setCompanies(data)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}//users/all`);
      const data = response.data?.data.map((item) => {
        return {
          value: item?._id, label: item?.firstName + " " + item?.lastName
        }
      })
      setUsers(data)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  useEffect(() => {
    fetchCompanies()
    fetchUsers()
  }, [])


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      if (formData._id) {
        await axios.put(
          `${base_url}/tasks/${formData._id}`, // Adjust endpoint if needed
          formData
        );
      }
      else {
        await axios.post(
          `${base_url}/tasks`, // Adjust endpoint if needed
          formData
        );
      }
      fetchTasks();
      setFormData(defaultData);
    } catch (error) {
      setError(error.message);
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };



  useEffect(() => {
    // Fetch existing task data if `companyId` is provided
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/tasks/${companyId}`
        );
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

    if (companyId) {
      setShowForm(true);
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

  const isDate = (value) => {
    return moment(value, moment.ISO_8601, true).isValid();
  };

  useEffect(() => {
    console.log(formData)
    if (formData?.taskType === "gst") {
      const gstData = getGstData(formData)
      const data = [...tasks, ...gstData]
      setTasks(data)
    } else if (formData?.taskType === "providentFund") {
      setTasks(tasks)
    }
  }, [formData])

  const getFields = (field) => {
    if (field.id === "company") {
      return companies
    } else if (field.id === "assignedTo") {
      return users
    } else return field?.options
  }

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      <header
        className="text-black p-2 rounded-t-lg"
        style={{ background: "#f5f5f5" }}
      >
        <h1 className="text-2xl font-bold">Create New Task</h1>
      </header>
      {showForm && (
        <form onSubmit={handleSubmit} className="p-3">
          <div
            key={""}
            className="mb-2 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
              {"Task Form"}
            </h2>
            <div className="grid grid-cols-4 gap-5 ">
              {taskData?.map((field, index) => {
                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={index}
                      id={field.id}
                      label={field.label}
                      options={getFields(field)}
                      value={formData[field.id]}
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
                    value={formData[field.id]}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowForm(false);
              }}
              className="px-4 ms-2 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <h3 className="text-red-500">{error}</h3>}
    </div>
  );
};

export default Taskform;
