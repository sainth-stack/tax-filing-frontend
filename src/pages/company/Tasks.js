import React, { useState } from "react";
import { Button } from "@mui/material";
import Layout from "./../../components/Layout/Layout";
import CustomInput from "../../components/input";
import TasksTable from "./Tasks/TaskTable";
import DateInput from "../../components/Date/DateInput";
import { Dates } from "../../pages/company/data";
import Taskform from "./Tasks/Taskform";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [formValues, setFormValues] = useState({
    effectiveFrom: "",
    effectiveTo: "",
  });
  const [companyRefresh, setCompanyRefresh] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto my-6">
        <div className="flex flex-row my-3 justify-evenly ">
          <div className="flex items-center">
            <CustomInput
              id="company"
              label="Company"
              className="shadow-sm"
              value={name}
              type="text"
              placeholder="Company Name"
              onChange={(e) => setName(e.target.value)}
              labelStyles={{
                fontWeight: 500,
              }}
            />
          </div>

          {Dates[0].fields.map((field) => (
            <div key={field.id} className="flex items-center ">
              <DateInput
                type={field.type}
                id={field.id}
                className="shadow-sm"
                label={field.label}
                value={formValues[field.id]}
                onChange={handleDateChange}
                required={field.required}
                labelStyles={{
                  fontWeight: 500,
                }}
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
                setCompanyRefresh,
                companyRefresh,
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
              name,
              ...formValues,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
