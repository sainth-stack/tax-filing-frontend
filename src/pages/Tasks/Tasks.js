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

import Layout from "../../components/Layout/Layout";
import TasksTable from "./TaskTable";
import DateInput from "../../components/Date/DateInput";
import { Dates } from "../company/data";
import Taskform from "./Taskform";
import axios from "axios";

import CustomInput from "../../components/input";
import { taskSearch } from "./data";
import SelectInput from "../../components/select";
import { WidthFull } from "@mui/icons-material";
import { base_url } from "../../const";
import Loader from "../../components/helpers/loader";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showtasks, setShowTasks] = useState(false);
  const [companyId, setCompanyId] = useState("");
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
  });
  const [view, setView] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [companyRefresh, setCompanyRefresh] = useState(false);
  const [showAutoGenModal, setShowAutoGenModal] = useState(false); // For modal visibility
  const [autoGenData, setAutoGenData] = useState({
    company: "",
    taskType: "",
    year: new Date().getFullYear().toString(),
  });


  const location = useLocation();
  const taskId = location.state?.taskId;

  useEffect(() => {
    if (taskId) {
      setShowForm(true);
      setCompanyId(taskId);
    }
  }, [taskId]);

  // useEffect(() => {
  //   if (TaskId) {
  //     setView(true);
  //     setCompanyId(TaskId);
  //   }
  // }, [TaskId]);

  // useEffect(() => {
  //   if (PaymentGraphDetails) {
  //     setOpen(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (PendingTasksGraphDetails) {
  //     setOpen(true);
  //   }
  // }, []);
  // useEffect(() => {
  //   if (MeterGraph) {
  //     setOpen(true);
  //   }
  // }, []);


  const handleClose = () => {
    setOpen(false);
  };
  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleAutoGenInputChange = (e) => {
    const { id, value } = e.target;
    setAutoGenData((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        company: formData?.company,
        assignedTo: formData?.userId !== "all" ? formData?.userId : undefined,
        status: formData?.status !== "all" ? formData?.status : undefined,
        taskType: formData?.taskType !== "all" ? formData?.taskType : undefined,
        applicationSubStatus: formData?.applicationSubStatus,
        effectiveFrom: formData?.effectiveFrom,
        effectiveTo: formData?.effectiveTo,
      });
      setLoading(false);

      setTasks(data);
    } catch (error) {
      toast.error("Error While Tasks Filtering");
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${base_url}/users/all`);
      const data = response.data?.data.map((item) => ({
        value: item?._id,
        label: item?.firstName,
      }));
      setLoading(false);

      setUsers(data);
    } catch (error) {
      toast.error("Error While  Fetching ");

      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [formData]);

  //for  model
  const fetchCompanies = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${base_url}/companies/all`);

      const data = response.data?.data.map((item) => ({
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

  const fetchAllTasks = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${base_url}/tasks/all`);

      /* const data = response.data?.data.map((item) => ({
        value: item?._id,
        label: item?.firstName,
      })); */
      /* const { data } = response; */
      setLoading(false);

      setAllUsers(response);
    } catch (error) {
      toast.error("Error While  Fetching Tasks ");

      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchAllTasks();
  }, []);

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
    if (field.id === "userId") {
      return [{ label: "All", value: "all" }, ...users];
    } else {
      return field?.options;
    }
  };

  const handleAutoGenSubmit = async () => {
    try {
      const { company, taskType, year } = autoGenData;

      await axios.post(`${base_url}/tasks`, {
        company,
        taskType,
        year,
      });
      fetchTasks();
      setShowAutoGenModal(false);
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto my-6">
        <div className="flex flex-row my-3 gap-4">
          <div className="flex items-center gap-4">
            {taskSearch?.map((field, index) => {
              if (field?.type === "select") {
                return (
                  <SelectInput
                    key={index}
                    id={field?.id}
                    label={field?.label}
                    options={getFields(field)}
                    value={formData[field?.id]}
                    onChange={handleInputChange}
                    required={field?.required}
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
                value={formData[field.id]}
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
            Tasks
          </label>
          <div>

            {/* <Button
              variant="text"
              sx={{
                margin: ".7em",
                bgcolor: "teal",
                color: "white",
                "&:hover": {
                  bgcolor: "teal",
                  color: "white",
                  boxShadow: "1px 2px 3px gray",
                },
              }}
              onClick={() => setShowAutoGenModal(true)} // Show the auto-generation modal
            >
              Auto Generation
            </Button> */}
            <Button
              variant="text"
              sx={{
                margin: ".7em",
                bgcolor: "teal",
                color: "white",
                "&:hover": {
                  bgcolor: "teal",
                  color: "white",
                  boxShadow: "1px 2px 3px gray",
                },
              }}
              onClick={handleShowForm}
            >
              Add Tasks
            </Button>

            {(showForm || companyId) && (
              <Button
                variant="text"
                sx={{
                  margin: ".7em",
                  bgcolor: "red",
                  color: "white",
                  "&:hover": {
                    bgcolor: "white",
                    boxShadow: "1px 2px 3px gray",
                    color: "red",
                  },
                }}
                onClick={() => {
                  setCompanyId("");
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
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

        {showForm || companyId ? (
          <div className="justify-center">
            <Taskform
              {...{
                companyId,
                setCompanyId,
                setShowForm,
                showForm,
                view,

                setCompanyRefresh,
                companyRefresh,
                fetchTasks,
              }}
            />
          </div>
        ) : (
          ""
        )}

        <div className="bg-white rounded-lg shadow-md">
          <TasksTable
            {...{
              setCompanyId,
              companyRefresh,
              handleDelete,
              tasks,
              formData,
            }}
            dataLoading={loading}
          />
        </div>
      </div>

      {/* Auto-Generation Modal */}
      <Modal
        open={showAutoGenModal}
        onClose={() => setShowAutoGenModal(false)}
        aria-labelledby="auto-gen-modal-title"
        aria-describedby="auto-gen-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 5,
            width: "600px",
            borderRadius: 2,
          }}
        >
          <Typography id="auto-gen-modal-title" variant="h6" component="h2">
            Auto Generate Tasks
          </Typography>
          <div
            className="mt-4"
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <SelectInput
              id="company"
              label="Company"
              options={companies.map((company) => ({
                label: company.label,
                value: company.value,
              }))}
              value={autoGenData.company}
              onChange={handleAutoGenInputChange}
            />

            <SelectInput
              id="taskType"
              label="Task Type"
              options={[
                { value: "gst", label: "GST" },
                { value: "providentFund", label: "Provident Fund" },
                { value: "incomeTax", label: "Income Tax" },
                { value: "tds", label: "TDS and TCS" },
                { value: "esi", label: "ESI" },
                { value: "professionalTax", label: "Professional Tax" },
              ]}
              value={autoGenData.taskType}
              onChange={handleAutoGenInputChange}
            />
            <CustomInput
              id="year"
              label="Year"
              type="number"
              value={autoGenData.year}
              onChange={handleAutoGenInputChange}
              placeholder="Enter year"
            />
          </div>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={handleAutoGenSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowAutoGenModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Tasks;
