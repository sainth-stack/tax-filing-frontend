import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import CustomInput from "./input";
import CustomFileInput from "./customFile";
import SelectInput from "./select";
import { useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TextArea from "./text-area";
export default function Accordian({
  sections,
  expanded,
  handleAccordian,
  formData={},
  clientStatus,
  companyId,
  disabled,
  view,
}) {
  const [accData, setAccData] = React.useState([]);
  const getActive = (section, index) => {
    if (section.title == "Company Details") {
      return section.formData[section.id]?.clientStatus === "active";
    } else {
      return section.formData[section.id]?.status === "active";
    }
  };

  useEffect(() => {
    if (sections) {
      const companDetails = sections.filter(
        (item) => item.title === "Company Details"
      )[0]?.formData?.companyDetails;
      const data = sections.filter((item) => {
        if (item.title === "Partnership Firm Form C") {
          return companDetails?.constitution === "Partnership" &&
            companDetails?.subConstitution === "registered"
            ? true
            : false;
        } else if (item.title === "MCA") {
          return companDetails?.constitution === "PrivateLimited" ||
            companDetails?.subConstitution === "llp"
            ? true
            : false;
        } else return true;
      });
      setAccData(data);
    }
  }, [sections]);

  if (!accData) return null;
  return (
    <div className="p-2 ">
      {accData.map((section, index) => {
        console.log(accData)
        return (
          <>
            {companyId && companyId && view ? (
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
                              readOnly={field.readonly}
                            />
                          );
                        }
                        else if (field.type === "textarea") {
                          return (
                            <TextArea
                              key={index}
                              id={field?.id}
                              label={field.label}
                              required={field.required}
                              readOnly={field.readOnly}
                              onChange={section.handleInputChange}
                              value={
                                section.formData[sectionKey]?.[fieldKey] || ""
                              }
                            />
                          );
                        }
                        else if (field.type === "file") {
                          return (
                            <CustomFileInput
                              key={fieldIndex}
                              id={fieldId}
                              label={field.label}
                              required={field.required}
                              readOnly={field.readonly}
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
                            readOnly={field.readOnly}
                            onChange={section.handleInputChange}
                            value={
                              section.formData[sectionKey]?.[fieldKey] || ""
                            }
                            placeholder={field.placeholder || ""}
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
                    }
                    else if (field.type === "textarea") {
                      return (
                        <TextArea
                          key={index}
                          id={field?.id}
                          label={field.label}
                          required={field.required}
                          readOnly={field.readOnly}
                          onChange={section.handleInputChange}
                          value={
                            section.formData[sectionKey]?.[fieldKey] || ""
                          }
                        />
                      );
                    }
                    else if (field.type === "file") {
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
                        disabled={disabled}
                        readOnly={field?.readOnly}
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
