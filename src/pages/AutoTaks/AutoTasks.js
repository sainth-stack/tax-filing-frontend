import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import Layout from "../../components/Layout/Layout";
import { taskSearch } from "../Tasks/data";
import SelectInput from "../../components/select";
import CustomInput from "../../components/input";
import DateInput from "../../components/Date/DateInput";
import AutoTasksTable from "./AutoTaskTable";
import { base_url } from "../../const";
import { Dates } from "../company/data";
import AutoTaskForm from "./AutoTaskForm";

const AutoTasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showtasks, setShowTasks] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    company: "",
    assignedTo: '',
    applicationSubstatus: "",
    status: "notFiled",
    effectiveFrom: "",
    effectiveTo: "",
    defaultValue: "",
    taskType: "",
    month: '',
    year: new Date().getFullYear().toString()
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


  /* pagination */
  const [page, setPage] = useState(0); // Default page 1
  const [pageSize, setPageSize] = useState(5);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    if (taskId) {
      setShowForm(true);
      setCompanyId(taskId);
    }
  }, [taskId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setPage(0)
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
      const { data } = await axios.post(`${base_url}/tasks/auto/filter`, {
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
        list: user.role !== "A" ? user?._id : '',
        page: page + 1,
        pageSize: pageSize
      });
      setLoading(false);
      // console.log("filtrede users", data);
      setTasks(data?.tasks);
      setTotalTasks(data?.totalTasks);

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
        label: item?.firstName + " " + (item?.lastName || ''),
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
  }, [formData,page, pageSize]);

  //for  model
  const fetchCompanies = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${base_url}/companies/filter`, {
        userId: user.role !== "A" ? user?._id : ''
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
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      await axios.delete(`${base_url}/tasks/auto/${id}`);

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
      return [field?.options, ...users];
    } else {
      return field?.options;
    }
  };

  const handleAutoGenSubmit = async () => {
    try {
      const { company, taskType, year } = autoGenData;

      await axios.post(`${base_url}/tasks/auto`, {
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
            Auto Tasks
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

        {showForm || companyId ? (
          <div className="justify-center">
            <AutoTaskForm
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
          <AutoTasksTable
            {...{
              setCompanyId,
              companyRefresh,
              handleDelete,
              tasks,
              formData,
              fetchTasks,
              setPage,
              page,
              totalTasks,
              pageSize,
              setPageSize,
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

export default AutoTasks;
