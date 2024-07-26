import React, { useState } from "react";

import { Button } from "@mui/material";
import CompanyTable from "./CompanyTable";
import Layout from "./../../components/Layout/Layout";
import ServiceTable from "../../components/services/Servicetable";
import CompanyForm from "./Companyform";
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import Serviceform from "./Serviceform";

const Company = () => {
  const [showForm, setShowForm] = useState(false);
  const [serviceForm, setServiceForm] = useState(true);
  const handleServiceForm = () => {
    setServiceForm(!serviceForm);
  };
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  return (
    <>
      <Layout>
        <div className="">
          <div className="flex flex-row my-3 gap-4">
            <div className="flex items-center">
              <CustomInput
                id="company"
                label="Company"
                type="text"
                // value={formData.company || ''}
                // onChange={handleInputChange}
                placeholder="Company Name"
                labelStyles={{
                  fontWeight: 500,
                }}
              />
            </div>
            <div className="flex items-center">
              <SelectInput
                id="status"
                label="Status"
                // value={formData.status || ''}
                // onChange={handleInputChange}
                options={[
                  { value: "", label: "Select Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                labelStyles={{
                  fontWeight: 500,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label
              htmlFor="Table"
              className="block mb-2 text-xl font-medium text-gray-900 ps-2 pt-4"
            >
              Company
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
                  },
                }}
                onClick={handleShowForm}
              >
                Add New Company
              </Button>
            </div>
          </div>
          {showForm && showForm ? (
            <div className="justify-center">{<CompanyForm />}</div>
          ) : (
            ""
          )}
          <div className="bg-white rounded-lg shadow-md">
            <CompanyTable />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label
            htmlFor="Table"
            className="block mb-2 text-xl font-medium text-gray-900 ps-2 pt-4"
          >
            Services
          </label>
          <div>
            <Button
              onClick={handleServiceForm}
              variant="text"
              sx={{
                margin: ".7em",
                bgcolor: "teal",
                color: "white",
                "&:hover": {
                  bgcolor: "teal",
                  color: "white",
                },
              }}
            >
              Add Service
            </Button>
          </div>
        </div>
        {serviceForm && serviceForm ? (
          <div className="justify-center">{<Serviceform />}</div>
        ) : (
          ""
        )}
        <div className="mt-6 bg-white rounded-lg shadow-md">
          <ServiceTable />
        </div>
      </Layout>
    </>
  );
};

export default Company;
