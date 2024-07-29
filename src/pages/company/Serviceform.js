import React, { useState } from "react";
import axios from "axios";
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import { services } from "./data";
import { base_url } from "../../const";

const Serviceform = ({ setRefresh, refresh }) => {
  const defaultData = {
    serviceName: "",
    status: "",
    effectiveFrom: "",
    effectiveTo: "",
  };
  const [formData, setFormData] = useState(defaultData);

  const [error, seterror] = useState();
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.API_URL);
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        `${base_url}/services`,
        formData
      );
      setRefresh(!refresh);
      setFormData(defaultData);
      console.log("Form submitted:", response.data);
    } catch (error) {
      seterror(error.message);
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
        <h1 className="text-2xl font-bold">Create New Service</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-2">
        {services.map((service, serviceIndex) => (
          <div
            key={serviceIndex}
            className="mb-1 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
              {service.title}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
              {service.fields.map((field, index) => {
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
        </div>
      </form>
      <h3>{error}</h3>
    </div>
  );
};

export default Serviceform;
