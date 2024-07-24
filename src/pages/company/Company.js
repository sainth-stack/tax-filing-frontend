import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CompanyTable from "./CompanyTable";
import Layout from "./../../components/Layout/Layout";
import ServiceTable from "../../components/services/Servicetable";
import CompanyForm from "./Companyform";

const Company = () => {
  const [showForm, setShowForm] = useState(false);
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  return (
    <>
      <Layout>
        <div className="p-4">
          <div className="flex flex-row justify-evenly my-3">
            <div className="flex items-center">
              <label
                htmlFor="company"
                className="mr-2 text-sm  font-medium text-gray-900"
              >
                Company
              </label>
              <input
                placeholder="Company Name"
                type="text"
                id="company"
                className="mx-4 rounded-lg outline outline-blue-100 border-gray-300 p-1.5 text-gray-700 sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="status"
                className="mr-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                id="status"
                className="mx-4 rounded-lg outline outline-blue-100   border-gray-300 p-1.5 text-gray-700 sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex btn  justify-center my-4">
            <Link
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              to="#"
            >
              Search
            </Link>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <label
              htmlFor="Table"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Company
            </label>
            <CompanyTable />
          </div>
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
              ADD NEW COMPANY
            </Button>
          </div>

          {showForm && showForm ? (
            <div className="justify-center">{<CompanyForm />}</div>
          ) : (
            ""
          )}
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <label
            htmlFor="Table"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Services
          </label>
          <ServiceTable />
        </div>
      </Layout>
    </>
  );
};

export default Company;
