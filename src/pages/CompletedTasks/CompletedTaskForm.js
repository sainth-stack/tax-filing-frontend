import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { base_url } from "../../const";
import CustomCheckbox from "../../components/Checkbox/Checkbox";
import SelectInput from "../../components/select";
import TextArea from "../../components/text-area";
import CustomInput from "../../components/input";
import CustomFileInput from "../../components/customFile";
import Loader from "../../components/helpers/loader";
import { Box, Button } from "@mui/material";

const CompletedTaskForm = ({
  showForm,
  setShowForm,
  fetchTasks,
  companyId,
  completedTaskView,
  tasks,
  error,
  selectedTask,
}) => {
  console.log("selectedTask vishnu", selectedTask);
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/users/all`);
      const data = response.data?.data.map((item) => ({
        value: item?._id,
        label: `${item?.firstName}`,
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("showForm state:", showForm);

    if (!showForm) {
      setFormData({});
      return;
    }

    if (selectedTask) {
      setFormData(selectedTask);
      fetchUsers();
    }
  }, [showForm, selectedTask]);

  useEffect(() => {
    console.log("formData updated:", formData);
    console.log("Users:", users);
  }, [formData, users]);

  const getFieldType = (key, value) => {
    if (
      key.includes("Date") ||
      moment(value, moment.ISO_8601, true).isValid()
    ) {
      return "date";
    }
    if (key === "priority" || key === "assignedTo") {
      return "select";
    }
    if (typeof value === "string" && value.length > 100) {
      return "textarea";
    }
    return "text";
  };

  // Priority options as objects
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // Find the selected user object for assignedTo
  const getAssignedToValue = (assignedToId) => {
    const selected = users.find((user) => user.value === assignedToId);
    console.log(
      "getAssignedToValue - Input:",
      assignedToId,
      "Output:",
      selected
    );
    return selected || null;
  };

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      {showForm ? (
        <>
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader size={30} />
            </div>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                setShowForm(false);
                setFormData({})
              }}
            >
              Close Task View
            </Button>
          </Box>
          <header
            className="p-2 text-black rounded-t-lg"
            style={{ background: "#f5f5f5" }}
          >
            <h1 className="text-2xl font-bold">Completed Task View</h1>
          </header>

          <form className="p-3">
            <div className="p-2 mb-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <h2 className="pb-2 mb-2 text-xl font-semibold border-b border-gray-200">
                Task Form
              </h2>
              <div className="grid grid-cols-4 gap-5">
                {Object.keys(formData)
                  .filter((key) => key !== "__v" && key !== "_id")
                  .map((key, index) => {
                    const value = formData[key];
                    const fieldType = getFieldType(key, value);
                    let displayValue =
                      fieldType === "date" && value
                        ? moment(value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format(
                            "YYYY-MM-DD"
                          )
                        : value || "";

                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    if (fieldType === "select" && key === "priority") {
                      console.log("Priority raw value:", value);
                      return (
                        <SelectInput
                          key={index}
                          id={key}
                          label={label}
                          value={value} // Pass the raw string from formData
                          options={priorityOptions} // Use object options
                          disabled={true}
                        />
                      );
                    } else if (fieldType === "select" && key === "assignedTo") {
                      const selectedUser = getAssignedToValue(value);
                      return (
                        <SelectInput
                          key={index}
                          id={key}
                          label={label}
                          value={selectedUser} // Pass the full user object
                          options={users}
                          disabled={true}
                        />
                      );
                    } else if (fieldType === "textarea") {
                      return (
                        <TextArea
                          key={index}
                          id={key}
                          label={label}
                          value={displayValue}
                          disabled={true}
                        />
                      );
                    } else if (
                      fieldType === "text" ||
                      fieldType === "date" ||
                      fieldType === "number"
                    ) {
                      return (
                        <CustomInput
                          key={index}
                          id={key}
                          type={fieldType}
                          label={label}
                          value={displayValue}
                          disabled={true}
                        />
                      );
                    } else if (fieldType === "file") {
                      return (
                        <CustomFileInput
                          key={index}
                          id={key}
                          label={label}
                          link={displayValue}
                          disabled={true}
                        />
                      );
                    }
                    return null;
                  })}
                <div className="flex justify-end col-span-4 mt-4">
                  <button
                    type="submit"
                    className="px-2 py-2 text-white bg-gray-400 rounded-lg cursor-not-allowed w-30"
                    disabled={true}
                  >
                    Task View
                  </button>
                </div>
              </div>
              {error && <div className="mt-2 text-red-500">{error}</div>}
            </div>
          </form>
        </>
      ) : (
        <div>No form to display</div>
      )}
    </div>
  );
};

export default CompletedTaskForm;
