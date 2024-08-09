import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import CustomInput from "./input";
import CustomFileInput from "./customFile";
import SelectInput from "./select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
export default function Accordian({
  sections,
  expanded,
  handleAccordian,
  clientStatus,
  companyId,
  disabled,
}) {
  const getActive = (section, index) => {
    if (section.title == "Company Details") {
      return section.formData[section.id]?.clientStatus === "active";
    } else {
      return section.formData[section.id]?.status === "active";
    }
  };

  if (!sections) return null;
  return (
    <div className="p-2 ">
      {sections.map((section, index) => {
        return (
          <>
            {companyId && companyId ? (
              <>
                {getActive(section, index) && (
                  <Accordion
                    key={index}
                    className="mb-2 border border-gray-300 rounded-lg shadow-md"
                    expanded={expanded.includes(section.title)}
                    onChange={() => handleAccordian(section.title)}
                  >
                    <div style={section.sectionStyle}>
                      <AccordionSummary
                        className={`shadow-md rounded-t-lg`}
                        // style={{ background: getActive(section, index) ? "green" : "" }}
                        expandIcon={<KeyboardArrowDownIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <div className=" ">
                          <Typography
                            component="div"
                            className="font-bold text-2xl gap-[10px]"
                          >
                            {section.title}{" "}
                            {getActive(section, index) && (
                              <CheckCircleOutlineIcon
                                sx={{
                                  background: "#25D366",
                                  color: "white",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </Typography>
                        </div>
                      </AccordionSummary>
                    </div>
                    {/* //bg */}
                    <AccordionDetails
                      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4`}
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
                              value={
                                section.formData[sectionKey]?.[fieldKey] || ""
                              }
                              onChange={section.handleInputChange}
                              required={field.required}
                              disabled="true"
                            />
                          );
                        } else if (field.type === "file") {
                          return (
                            <CustomFileInput
                              key={fieldIndex}
                              id={fieldId}
                              label={field.label}
                              required={field.required}
                              link={
                                section.formData[sectionKey]?.[fieldKey] || ""
                              }
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
                            value={
                              section.formData[sectionKey]?.[fieldKey] || ""
                            }
                            placeholder={field.placeholder || ""}
                            disabled="true"
                          />
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            ) : (
              <Accordion
                key={index}
                className="mb-2 border border-gray-300 rounded-lg shadow-md"
                expanded={expanded.includes(section.title)}
                onChange={() => handleAccordian(section.title)}
              >
                <div style={section.sectionStyle}>
                  <AccordionSummary
                    className={`shadow-md rounded-t-lg`}
                    // style={{ background: getActive(section, index) ? "green" : "" }}
                    expandIcon={<KeyboardArrowDownIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <div className=" ">
                      <Typography
                        component="div"
                        className="font-bold text-2xl gap-[10px]"
                      >
                        {section.title}{" "}
                        {getActive(section, index) && (
                          <CheckCircleOutlineIcon
                            sx={{
                              background: "#25D366",
                              color: "white",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </Typography>
                    </div>
                  </AccordionSummary>
                </div>
                {/* //bg */}
                <AccordionDetails
                  className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4`}
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
            )}
          </>
        );
      })}
    </div>
  );
}
