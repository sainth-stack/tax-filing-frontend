import React, { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
import Layout from './../../components/Layout/Layout';
import CustomInput from "../../components/input";
import SelectInput from "../../components/select";
import AgencyForm from "./AgencyForm";
import AgencyTable from "./AgencyTable";
import DateInput from "../../components/Date/DateInput";
import { Dates } from "../company/data";

const Company = () => {
    const [showForm, setShowForm] = useState("");
    const [view, setView] = useState(false);
    //const [editAgencyId, setEdiAgencyId] = useState(null);

    const [agencyId, setAgencyId] = useState(null);
    const [agencyName, setagencyName] = useState("");
    const [status, setStatus] = useState("");



    const handleShowForm = () => {
        setShowForm(!showForm);
    };

    const [agencyRefresh, setAgencyRefresh] = useState(false);

    const [formData, setFormData] = useState({
        effectiveFrom: "",
        effectiveTo: "",
    });

    // 
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };
    return (
        <>
            <Layout>
                <div className="">
                    <div className="flex flex-row my-3 gap-4">
                        <div className="flex items-center">
                            <CustomInput
                                id="AgencyDetails.agencyName"
                                label="Agency"
                                className="shadow-sm"
                                value={agencyName}
                                type="text"
                                placeholder="Agency Name"
                                onChange={(e) => setagencyName(e.target.value)}
                                labelStyles={{
                                    fontWeight: 500,
                                }}
                            />
                        </div>
                        <div className="flex items-center">


                            {/* Effective commented */}
                            {Dates[0].fields.map((field) => (
                                <Box key={field.id} className="flex items-center mx-4">
                                    <DateInput
                                        type={field.type}
                                        id={field.id}
                                        className="shadow-sm"
                                        label={field.label}
                                        value={formData[field.id] || ""}
                                        onChange={handleInputChange}
                                        required={field.required}
                                        labelStyles={{ fontWeight: 500 }}
                                    />
                                </Box>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <label
                            htmlFor="Table"
                            className="block mb-2 text-xl font-medium text-gray-900 ps-2 pt-4"
                        >
                            Agency
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
                                Add New Agency
                            </Button>
                            {(showForm || agencyId) && (
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
                                        setAgencyId("");
                                        setShowForm(false);
                                    }}
                                >
                                    cancel
                                </Button>
                            )}
                        </div>
                    </div>
                    {showForm || agencyId ? (
                        <div className="justify-center">
                            {
                                <AgencyForm
                                    {...{

                                        agencyId,
                                        setAgencyId,
                                        setShowForm,
                                        showForm,
                                        agencyRefresh,
                                        setAgencyRefresh,
                                        view,
                                        setView,

                                    }}
                                />
                            }
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="bg-white rounded-lg shadow-md">
                        <AgencyTable
                            {...{
                                agencyId,
                                view,
                                status,
                                setAgencyId,
                                agencyRefresh,
                                setAgencyRefresh,
                                agencyName,
                                formData,
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
