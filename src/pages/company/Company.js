import React, { useEffect, useState } from "react";

import { Button } from "@mui/material";
import CompanyTable from "./CompanyTable";
import Layout from "./../../components/Layout/Layout";
import CompanyForm from "./Companyform";
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import { useLocation } from "react-router";

const Company = () => {
  const [showForm, setShowForm] = useState("");
  const [view, setView] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const location = useLocation();
  const companyName = location.state?.companyName;

  useEffect(() => {
    if (companyName) {
      setView(true)
      setCompanyId(companyName)
    }
  }, [companyName]);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

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
                value={name}
                type="text"
                placeholder="Company Name"
                onChange={(e) => setName(e.target.value)}
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All" },
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
            <div className="flex">
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
                    view,
                    setView,
                    //companyName,
                  }}
                />
              }
            </div>
          ) : (
            ""
          )}
          <div className="bg-white rounded-lg shadow-md">
            <CompanyTable
              {...{
                setCompanyId,
                companyRefresh,
                name,
                status,
                setView,
                //companyName,
              }}
            />
          </div>
        </div>

        {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        <div className="mx-auto shadow-lg rounded-md p-3"></div> */}
      </Layout>
    </>
  );
};

export default Company;
