import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { Remove } from "@mui/icons-material";
import CustomInput from "./input";
import CustomFileInput from "./customFile";
import SelectInput from "./select";

export default function Accordian({
  sections,
  expanded,
  handleAccordian,
  clientStatus,
}) {
  if (!sections) return null;

  return (
    <div className="p-2 ">
      {sections.map((section, index) => {
        // console.log(section)
        return (
          <Accordion
            key={index}
            className="mb-2 border border-gray-300 rounded-lg shadow-md"
            expanded={expanded.includes(section.title)}
            onChange={() => handleAccordian(section.title)}
          >
            <div style={section.sectionStyle}>
              <AccordionSummary
                className="shadow-md rounded-t-lg "
                expandIcon={
                  expanded.includes(section.title) ? (
                    <Remove />
                  ) : (
                    <AddIcon className="shadow-md rounded-lg" />
                  )
                }
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <div className=" ">
                  <Typography component="div" className="font-bold text-2xl ">
                    {section.title}
                  </Typography>
                </div>
              </AccordionSummary>
            </div>
            {/* //bg */}
            <AccordionDetails
              className={`grid grid-cols-1 gap-4 ${
                clientStatus === "active" ? "bg-green-500" : "bg-red-500"
              } md:grid-cols-2 lg:grid-cols-4`}
            >
              {section.fields.map((field, fieldIndex) => {
                const fieldId = field.id;
                const [sectionKey, fieldKey] = fieldId.split(".");
                if (field.type === "select") {
                  return (
                    <SelectInput
                      key={fieldIndex}
                      id={fieldId}
                      label={field.label}
                      options={field.options}
                      value={section.formData[sectionKey]?.[fieldKey] || ""}
                      onChange={section.handleInputChange}
                      required={field.required}
                    />
                  );
                } else if (field.type === "file") {
                  return (
                    <CustomFileInput
                      key={fieldIndex}
                      id={fieldId}
                      label={field.label}
                      required={field.required}
                      link={section.formData[sectionKey]?.[fieldKey] || ""}
                      onChange={section.handleFileChange}
                    />
                  );
                }
                return (
                  <CustomInput
                    key={fieldIndex}
                    type={field.type}
                    id={fieldId}
                    label={field.label}
                    required={field.required}
                    onChange={section.handleInputChange}
                    value={section.formData[sectionKey]?.[fieldKey] || ""}
                    placeholder={field.placeholder || ""}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
