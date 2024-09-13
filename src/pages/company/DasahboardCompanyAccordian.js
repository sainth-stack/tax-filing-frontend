import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SelectInput from "../../components/select";
import TextArea from "../../components/text-area";
import CustomInput from "../../components/input";
import { sectionsData } from "./data";
import { base_url } from "../../const";
import axios from "axios";

const DasahboardCompanyAccordian = ({ companyName }) => {
  const [expanded, setExpanded] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          name: companyName,
        });
        const { data } = response;

        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          _id: item._id,
        }));

        setFilteredCompanies(companyDetailsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, [companyName]);

  useEffect(() => {
    if (filteredCompanies.length > 0) {
      const sections = sectionsData({ companyDetails: filteredCompanies });
      const companyDetailsSection = sections.find(
        (section) => section.title === "Company Details"
      );
      setSectionData(companyDetailsSection);
    } else {
      setSectionData(null);
    }
  }, [filteredCompanies]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!sectionData) return null;

  return (
    <>
      {companyName && (
        <div className="p-2">
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleAccordionChange("panel1")}
            className="mb-2 border border-gray-300 rounded-lg shadow-md"
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              className="shadow-md"
            >
              <Typography className="font-bold text-2xl ">
                {sectionData.title}
                <CheckCircleOutlineIcon
                  sx={{
                    background: "#25D366",
                    color: "white",
                    borderRadius: "50%",
                    marginLeft: 1,
                  }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sectionData.fields.map((field, fieldIndex) => {
                const value =
                  filteredCompanies[0]?.[field.id.split(".")[1]] || ""; // Ensure proper value extraction based on field structure

                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={fieldIndex}
                      id={field.id}
                      label={field.label}
                      options={field.options}
                      value={value}
                      onChange={(e) => {
                        // Handle change
                      }}
                      required={field.required}
                    />
                  );
                } else if (field.type === "textarea") {
                  return (
                    <TextArea
                      key={fieldIndex}
                      id={field.id}
                      label={field.label}
                      required={field.required}
                      onChange={(e) => {
                        // Handle change
                      }}
                      value={value}
                    />
                  );
                }
                return (
                  <CustomInput
                    key={fieldIndex}
                    type={field.type}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    onChange={(e) => {
                      // Handle change
                    }}
                    value={value}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default DasahboardCompanyAccordian;
