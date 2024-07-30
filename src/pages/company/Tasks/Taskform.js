import React, { useState } from "react";
import axios from "axios";
import SelectInput from "../../../components/select";
import CustomInput from "../../../components/input";
import { tasks } from "../data";

const Taskform = ({ setRefresh, refresh }) => {
  // Define default data based on the structure of tasks
  const defaultData = tasks[0].fields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
  const [showform, setShowForm] = useState(true);
  const [formData, setFormData] = useState(defaultData);
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/tasks`, // Adjust endpoint if needed
        formData
      );

      setFormData(defaultData);
      console.log("Form submitted:", response.data);
    } catch (error) {
      setError(error.message);
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-md">
      <header
        className="text-black p-2 rounded-t-lg"
        style={{ background: "#f5f5f5" }}
      >
        <h1 className="text-2xl font-bold">Create New Task</h1>
      </header>
      {showform && (
        <form onSubmit={handleSubmit} className="p-3">
          {tasks.map((task, taskIndex) => (
            <div
              key={taskIndex}
              className="mb-2 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
                {task.title}
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mx-3 lg:grid-cols-6">
                {task.fields.map((field, index) => {
                  if (field.type === "select") {
                    return (
                      <SelectInput
                        key={index}
                        id={field.id}
                        label={field.label}
                        options={field.options}
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
          ))}
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
