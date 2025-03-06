import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SelectInput from "../select";
import MultiSelectInput from "../multi-select";
import Popup from "../Popup/Popup";

const RightSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isHovered,
  setIsHovered,
  isMobile,
  status,
  setStatus,
  year,
  handleYearChange,
  yearsJson,
  month,
  setMonth,
  monthsJson,
  company,
  setCompany,
  cps,
  taskType,
  setTaskType,
  taskTypeOptions,
  filedStatus,
  handleFiledStatusChange,
  isPopupOpen,
  setIsPopupOpen,
  reason,
  setReason,
  applicationSubStatus,
  setApplicationSubStatus,
  applicationSubstatusOptions
}) => {
  return (
    <Box>
    <Box
      sx={{
        position: "relative",
        width: "100%",
        transition: "transform 0.4s ease",
        display:'flex',
        justifyContent:'end'
      }}
    >
      <IconButton
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
        //   color: "white",
          transition: "0.3s ease-in-out",
          "&:hover": {
            bgcolor: "gray",
            color: "#fff",
            transform: "scale(1.1)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
          "&:active": {
            // transform: "scale(0.95)",
          },
        }}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

    </Box>
    {   isSidebarOpen &&   <div className="flex flex-col space-y-4 mt-6">
        <SelectInput
          id="status"
          className=" rounded-[4.79px] "
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          labelStyles={{ fontWeight: 500 }}
        />

        <MultiSelectInput
          id="year"
          OtherClasses=" rounded-[4.79px]"
          label="Select Year(s)"
          value={year}
          setValue={handleYearChange}
          options={yearsJson}
          isMulti={Array.isArray(year)}
        />

        <SelectInput
          id="month"
          className=" rounded-[4.79px]"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={monthsJson}
          labelStyles={{ fontWeight: 500 }}
        />

        <SelectInput
          id="company"
          className=" rounded-[4.79px]"
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          options={[{ label: "All", value: "0" }, ...cps]}
          labelStyles={{ fontWeight: 500 }}
        />

        <SelectInput
          id="taskType rounded-[4.79px]"
          className=""
          label="Task Type"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          options={[{ label: "All", value: "0" }, ...taskTypeOptions.options]}
          labelStyles={{ fontWeight: 500 }}
        />

        {taskType === "gst" && (
          <>
            <SelectInput
              id="filedStatus rounded-[4.79px]"
              className=""
              label="Filed Status"
              value={filedStatus}
              onChange={(e) => handleFiledStatusChange(e.target.value)}
              options={[
                { value: "all", label: "All" },
                { value: "filed", label: "Filed" },
                { value: "notfiled", label: "Not Filed" },
              ]}
              labelStyles={{ fontWeight: 500 }}
            />

            <Popup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              title="Reason for Not Filing"
            >
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: "100%", marginTop: "1rem" }}
                placeholder="Enter your reason here..."
              />
            </Popup>

            <SelectInput
              id="applicationSubStatus"
              className="shadow-sm"
              label="Type of GST"
              value={applicationSubStatus}
              onChange={(e) => setApplicationSubStatus(e.target.value)}
              options={[
                { label: "All", value: "0" },
                ...applicationSubstatusOptions,
              ]}
              labelStyles={{ fontWeight: 500 }}
            />
          </>
        )}
      </div>}
      </Box>

  );
};

export default RightSidebar;