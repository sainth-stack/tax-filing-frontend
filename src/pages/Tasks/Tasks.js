import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import TasksTable from "./TaskTable";
import DateInput from "../../components/Date/DateInput";
import { Dates } from "../company/data";
import Taskform from "./Taskform";
import axios from "axios";
import { base_url } from "../../const";
import CustomInput from "../../components/input";
import { taskSearch } from "./data";
import SelectInput from "../../components/select";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    assignedTo: "",
    applicationSubstatus: "",
    status: "",
    effectiveFrom: "",
    effectiveTo: "",
    defaultValue: "",
  });
  const [tasks, setTasks] = useState([]);
  const [companyRefresh, setCompanyRefresh] = useState(false);

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

  const fetchTasks = async () => {
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        company: formData?.company,

        assignedTo:
          formData?.assignedTo !== "all" ? formData?.assignedTo : undefined,
        status: formData?.status !== "all" ? formData?.status : undefined,

        applicationSubStatus: formData?.applicationSubStatus,
        effectiveFrom: formData?.effectiveFrom,
        effectiveTo: formData?.effectiveTo,
      });

      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/users/all`);
      const data = response.data?.data.map((item) => ({
        value: item?._id,
        label: item?.firstName + " " + item?.lastName,
      }));
      console.log("check all ", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [formData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${base_url}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
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

        {showForm || companyId ? (
          <div className="justify-center">
            <Taskform
              {...{
                companyId,
                setCompanyId,
                setShowForm,
                showForm,
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
