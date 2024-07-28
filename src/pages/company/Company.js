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
  const [showForm, setShowForm] = useState("");
  const [serviceForm, setServiceForm] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const handleServiceForm = () => {
    setServiceForm(!serviceForm);
  };
  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const [refresh, setRefresh] = useState(false);
  const [companyRefresh, setCompanyRefresh] = useState(false);
  return (
    <>
      <Layout>
        <div className="">
          <div className="flex flex-row my-3 gap-4">
            <div className="flex items-center">
              <CustomInput
                id="company"
                label="Company"
                className="shadow-sm"
                type="text"
                placeholder="Company Name"
                labelStyles={{
                  fontWeight: 500,
                }}
              />
            </div>
            <div className="flex items-center">
              <SelectInput
                id="status"
                className="shadow-sm"
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
                    boxShadow: "1px 2px 3px gray",
                  },
                }}
                onClick={handleShowForm}
              >
                Add New Company
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
                  cancel
                </Button>
              )}
            </div>
          </div>
          {showForm || companyId ? (
            <div className="justify-center">
              {
                <CompanyForm
                  {...{
                    companyId,
                    setCompanyId,
                    setShowForm,
                    setCompanyRefresh,
                    companyRefresh,
                  }}
                />
              }
            </div>
          ) : (
            ""
          )}
          <div className="bg-white rounded-lg shadow-md">
            <CompanyTable {...{ setCompanyId, companyRefresh }} />
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
          <div className="justify-center">
            {<Serviceform {...{ setRefresh, refresh }} />}
          </div>
        ) : (
          ""
        )}
        <div className="mt-6 bg-white rounded-lg shadow-md">
          <ServiceTable {...{ refresh }} />
        </div>
        <div className="mx-auto shadow-lg rounded-md p-3"></div>
      </Layout>
    </>
  );
};

export default Company;
