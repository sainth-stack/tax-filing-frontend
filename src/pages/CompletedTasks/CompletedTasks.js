import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";

import { CloseOutlined } from "@mui/icons-material";


import axios from "axios";

import { WidthFull } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { base_url } from "../../const";
import { taskSearch } from "../Tasks/data";
import SelectInput from "../../components/select";
import Layout from "../../components/Layout/Layout";
import CustomInput from "../../components/input";
import TasksTable from "../Tasks/TaskTable";
import Taskform from "../Tasks/Taskform";
import { Dates } from "../company/data";
import DateInput from "../../components/Date/DateInput";
import CompletedTasksTable from "./CompletedTasksTable";

const CompletedTasks = () => {
//   const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showtasks, setShowTasks] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(0); // Default page 1
  const [pageSize, setPageSize] = useState(5);
  const [totalTasks, setTotalTasks] = useState(0);

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    assignedTo: "",
    applicationSubstatus: "",
    status: "",
    effectiveFrom: "",
    effectiveTo: "",
    defaultValue: "",
    taskType: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [view, setView] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [companyRefresh, setCompanyRefresh] = useState(false);
 






 

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        company: formData?.company,
        assignedTo:
          formData?.assignedTo !== "all" ? formData?.assignedTo : undefined,
        status: formData?.status !== "all" ? formData?.status : undefined,
        taskType: formData?.taskType !== "all" ? formData?.taskType : undefined,
        applicationSubStatus: formData?.applicationSubStatus,
        effectiveFrom: formData?.effectiveFrom,
        effectiveTo: formData?.effectiveTo,
        month: formData?.month,
        year: formData?.year,
        list: user.role !== "A" ? user?._id : "",
      });
      setLoading(false);

      setTasks(data?.data);
    } catch (error) {
      toast.error("Error While Tasks Filtering");
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async (page, pageSize) => {
    try {
      // Pass page and pageSize as query parameters
      const response = await axios.get(`${base_url}/users/all`);

      const data = response?.data?.data.map((item) => ({
        value: item?._id,
        label: item?.firstName + " " + (item?.lastName || ""),
      }));

      // Optionally, you can also store pagination info (totalUsers, totalPages) if needed
      setUsers(data);
      setTotalPages(data.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // console.log("users Paginations] ", users);

  useEffect(() => {
    fetchTasks();
    fetchUsers(page, pageSize);
  }, [page, pageSize, formData]);

  //for  model
  const fetchCompanies = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.post(`${base_url}/companies/filter`, {
        userId: user.role !== "A" ? user?._id : undefined,
      });
      const data = response?.data?.data?.map((item) => ({
        value: item?.companyDetails?.TaskId,
        label: item?.companyDetails?.TaskId,
      }));
      setLoading(false);

      setCompanies(data);
    } catch (error) {
      toast.error("Error While Companies Fetching ");

      console.error("Error fetching companies:", error);
    }
  };

 const fetchAllTasks = async (page, pageSize) => {
   setLoading(true);

   try {
     // Fetch both manual and automatic tasks
     const [ManualTasksResponse, AutoTasksResponse] = await Promise.all([
       axios.get(`${base_url}/tasks/all`, {
         params: { page: page + 1, pageSize: pageSize },
       }),
       axios.get(`${base_url}/tasks/auto/all`, {
         params: { page: page + 1, pageSize: pageSize },
       }),
     ]);

     // Extract task data
     const allTasksData = ManualTasksResponse?.data?.data || [];
     const autoTasksData = AutoTasksResponse?.data?.data || [];
     console.log("manual tasks", allTasksData, allTasksData.length);
     console.log("auto tasks", autoTasksData, autoTasksData.length);

     // Combine all tasks
     const combinedTasks = [...allTasksData, ...autoTasksData];

     console.log("combined tasks count", combinedTasks.length);

     // Filter completed tasks
     const completedTasks = combinedTasks.filter((task) => {
       const actualCompletionDate =
         task?.actualCompletionDate ||
         task?.pfMonthly_filedate ||
         task?.esi_fileDate ||
         task?.pft_fileDate ||
         task?.gstMonthly_filedate;

       return (
         actualCompletionDate !== undefined && actualCompletionDate !== null
       );
     });

     // Update state with completed tasks
     console.log("Completed  tasks count", completedTasks.length);
      
     setTasks(completedTasks);
     console.log("Completed tasks:", completedTasks);
   } catch (error) {
     toast.error("Error While Fetching Tasks");
     console.error("Error fetching tasks:", error);
   } finally {
     setLoading(false);
   }
 };

    
    

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchAllTasks(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      await axios.delete(`${base_url}/tasks/${id}`);

      setLoading(false);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.warn("Task Deleted Successfully");
    } catch (error) {
      toast.error("Failed To Delete Task  ");

      console.error("Error deleting task:", error);
    }
  };

  const getFields = (field) => {
    if (field.id === "assignedTo") {
      return [{ label: "All", value: "all" }, ...users];
    } else {
      return field?.options;
    }
  };

  
    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData((prevValues) => ({
        ...prevValues,
        [id]: value,
      }));
    };


  return (
    <Layout>
     
      <div className="container mx-auto my-6">
        <div className="flex flex-row my-3 gap-4">
          <div className="flex items-center gap-4">
            {taskSearch(formData)?.map((field, index) => {
              if (field?.type === "select") {
                return (
                  <SelectInput
                    key={index}
                    id={field?.id}
                    label={field?.label}
                    options={getFields(field)}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    required={field.required}
                    defaultValue={field.defaultValue}
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
                  placeholder={field.placeholder}
                  className="shadow-sm"
                  labelStyles={{ fontWeight: 500 }}
                />
              );
            })}
          </div>

          {Dates[0].fields.map((field) => (
            <div key={field.id} className="flex items-center">
              <DateInput
                type={field.type}
                id={field.id}
                className="shadow-sm"
                label={field.label}
                value={formData[field?.id]}
                onChange={handleInputChange}
                required={field.required}
                labelStyles={{ fontWeight: 500 }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label
            htmlFor="Table"
            className="block mb-2 text-xl font-medium text-gray-900 ps-2 pt-4"
          >
           Completed Tasks
          </label>
        </div>

        {showtasks && showtasks.length > 0 && (
          <div>
            <h4>Task Details:</h4>
            <ul>
              {showtasks.map((task, index) => (
                <li key={index}>
                  <strong>{task}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <CompletedTasksTable
            {...{
              totalTasks,
              companyRefresh,
              handleDelete,
              tasks,
              setPage,
              page,
              pageSize,
              fetchAllTasks,
              setPageSize,
              formData,
              fetchUsers,
            }}
            dataLoading={loading}
          />
        </div>
      </div>

      {/* Auto-Generation Modal */}
    </Layout>
  );
};

export default CompletedTasks;
