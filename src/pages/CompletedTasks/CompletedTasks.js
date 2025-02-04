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
    assignedTo: "",
    effectiveFrom: "",
    effectiveTo: "",
    status: "filed",
    filedStatus: "all",
    reason: "",
    year: [],
    month: "0",
    company: "0",
    year: new Date().getFullYear().toString(),
    applicationSubStatus: "0"
  });
  const [view, setView] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [companyRefresh, setCompanyRefresh] = useState(false);
  const [filteredTasks, setfilteredTasks] = useState([]);

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

  useEffect(() => {
    fetchUsers(page, pageSize);
  }, [page, pageSize, formData]);

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
    
  useEffect(() => {
    fetchCompanies();
    fetchUsers();
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

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      const [tasksResponse, autoTasksResponse] = await Promise.all([
        axios.post(`${base_url}/tasks/filter`, {
          status: formData.status === "all" ? "" : formData.status,
          // status: formData.filedStatus === "all" ? "" : formData.filedStatus,
          reason: formData.reason ? formData.reason : undefined,
          year: formData.year.toString(),
          month: formData.month === "0" ? "" : formData.month,
          company: formData.company === "0" ? "" : formData.company,
          user: user.role !== "A" ? user?._id : "",
          list: user.role !== "A" ? user?._id : "",
          taskType: formData.taskType !== "0" ? formData.taskType : undefined,
          agency: user.agency,
          page: page + 1,
          pageSize,
          applicationSubStatus:
            formData.applicationSubStatus !== "0" ? formData.applicationSubStatus : "",
        }),
        axios.post(`${base_url}/tasks/auto/filter`, {
          status: formData.status === "all" ? "" : formData.status,
          // status: formData.filedStatus === "all" ? "" : formData.filedStatus,
          reason: formData.reason ? formData.reason : undefined,
          year: formData.year.toString(),
          month: formData.month === "0" ? "" : formData.month,
          company: formData.company === "0" ? "" : formData.company,
          user: user.role !== "A" ? user?._id : "",
          list: user.role !== "A" ? user?._id : "",
          taskType: formData.taskType !== "0" ? formData.taskType : undefined,
          agency: user.agency,
          page: page + 1,
          pageSize,
          applicationSubStatus:
            formData.applicationSubStatus !== "0" ? formData.applicationSubStatus : "",
        })
      ]);
      const autoTasks = autoTasksResponse?.data?.tasks?.map(item => ({
        ...item,
        auto: true
      }));
setTotalTasks(autoTasksResponse.data?.totalTasks+tasksResponse?.data?.totalTasks)
      setTasks([...tasksResponse?.data?.data, ...autoTasks]);
    } catch (error) {
      toast.error("Error While Tasks Filtering");
      console.error("Error fetching filtered tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [formData, page, pageSize]);
console.log(formData)
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
              fetchAllTasks:handleFilterChange,
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
