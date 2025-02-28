import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import MenuIcon from '@mui/icons-material/Menu';
import SelectInput from "../select";
import axios from "axios";
import { base_url } from "../../const";
import PaymentGraph from "./PaymentGraph";
import MeterGraph from "./MeterGraph";
import PendingCompeltedTaksGraph from "./PendingCompeltedTaksGraph";
import {
  applicationSubstatusOptions,
  monthsJson,
  taskTypeOptions,
} from "./FilterData";
import Popup from "../Popup/Popup";
import MultiSelectInput from "../multi-select";
import { Box, Drawer, Grid, IconButton, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TaskProgressGaugePage from "./SemiCircle/TaskProgressGaugePage";

const Charts = () => {
  const currentYear = new Date().getFullYear();
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isHovered, setIsHovered] = React.useState(false);

  
  const [filedStatus, setFiledStatus] = useState("all");
  const [reason, setReason] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [companies, setCompanies] = useState([]);
  const [taskType, setTaskType] = useState("0");
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [applicationSubStatus, setApplicationSubStatus] = useState('0');
  const [month, setMonth] = useState('0');

const [year, setYear] = useState([
   { value: currentYear, label: `${currentYear}` },
]);

  const [cps, setcps] = useState([])
  const [company, setCompany] = useState('0');
  const user = JSON.parse(localStorage.getItem('user'))

  const handleFiledStatusChange = (value) => {
    setFiledStatus(value);
  };

   const yearsJson = Array.from({ length: 10 }, (_, i) => ({
     label: `${currentYear - i}`,
     value: currentYear - i,
   }));

  //  Set the default value as the current year

  

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          userId: user.role !== "A" ? user?._id : "",
          agency: user.agency,
        });
        setLoading(false);

        const { data } = response?.data;

        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          ...item,
          _id: item._id,
          label: item.companyDetails?.companyName,
          value: item.companyDetails?.companyName,
        }));

        setcps(companyDetailsArray);

        // Log client statuses
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
         
        const response = await axios.post(`${base_url}/companies/filter`, {
          status: status === "all" ? "" : status,
          year:year?.map((item)=>item.value).join(','),
          month: month === "0" ? "" : month,
          name: company === "0" ? "" : company,
          userId: user.role !== "A" ? user?._id : "",
          taskType: taskType !== "0" ? taskType : undefined,
          agency: user.agency,
          // status: filedStatus === "all" ? "" : filedStatus,
        });
        setLoading(false);
        const { data } = response?.data;
        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          ...item,
          _id: item._id,
        }));

        setCompanies(companyDetailsArray);

        //  console.log("Fetched company data:", companyDetailsArray);
        // console.log("Fetched statuses:", statusesArray);

        // Log client statuses
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, [
    status,
    year,
    month,
    company,
    taskType,
    filedStatus,
    applicationSubStatus,
  ]);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        status: status === "all" ? "" : status,
        status: filedStatus === "all" ? "" : filedStatus,
        reason: reason ? reason : undefined,
        year:year?.map((item)=>item.value).join(','),
        month: month === "0" ? "" : month,
        company: company === "0" ? "" : company,
        user: user.role !== "A" ? user?._id : "",
        list: user.role !== "A" ? user?._id : "",
        taskType: taskType !== "0" ? taskType : undefined,
        agency: user.agency,
        applicationSubStatus:
          applicationSubStatus !== "0" ? applicationSubStatus : "",
      });

      const response = await axios.post(`${base_url}/tasks/auto/filter`, {
        status: status === "all" ? "" : status,
        // filedStatus: filedStatus === "all" ? "" : filedStatus,
        reason: reason ? reason : undefined,
        year:year?.map((item)=>item.value).join(','),
        month: month === "0" ? "" : month,
        company: company === "0" ? "" : company,
        user: user.role !== "A" ? user?._id : "",
        list: user.role !== "A" ? user?._id : "",
        taskType: taskType !== "0" ? taskType : undefined,
        agency: user.agency,
        applicationSubStatus:
          applicationSubStatus !== "0" ? applicationSubStatus : "",
      });
      const finData1 = response?.data?.tasks?.map((item) => {
        return {
          ...item,
          auto: true,
        };
      });
      setfilteredTasks([...data?.data, ...finData1]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [
    year,
    month,
    company,
    taskType,
    filedStatus,
    applicationSubStatus,
    reason,
  ]);

  const handleYearChange = (selectedOptions) => {
    // Handle both single selection and array of selections
    const options = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
    
    const simplifiedOptions = options.map(option => ({
      value: option.value,
      label: option.label
    }));

    setYear(simplifiedOptions);
  };


  const [categories, setCategories] = useState([]);

  return (
    <Grid container>
      {/* Center Content - Graphs */}
      <Grid item xs={12} container sx={{ gap: ".5rem" }}>
        <Grid
          item
          xs={12} // Use xs={12} to span full width, adjust as needed
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            bgcolor: "white",
          }}
        >
          {/* <TaskProgressGaugePage categories={categories} loading={loading} setCategories={setCategories} /> */}
        </Grid>

        <ChartCard xs={10} >
          <MeterGraph
            MeterGraphDetails={companies}
            filteredTasks={filteredTasks}
            loading={loading}
          />
        </ChartCard>

        <ChartCard>
          <PieChart companyDetails={companies} loading={loading} />
        </ChartCard>

        <ChartCard>
          <BarChart barDetails={companies} loading={loading} />
        </ChartCard>

        <ChartCard>
          <PaymentGraph
            paymentGraphDetails={companies}
            filterTime2={filteredTasks}
            loading={loading}
          />
        </ChartCard>

        <ChartCard>
          <PendingCompeltedTaksGraph
            PendingCompeltedTaksGraphDetails={companies}
            filteredTasks={filteredTasks}
            loading={loading}
          />
        </ChartCard>
      </Grid>

      {/* right side bar */}

      <Grid item xs={2}>
        {/* Toggle Button - Hamburger Menu */}
        <Tooltip
          title={isSidebarOpen ? "Close Menu" : "Open Menu"}
          arrow
          placement={isSidebarOpen ? "top" : "left"}
          open={!isSidebarOpen || isHovered} // Always visible when closed, dynamic on hover
        >
          <IconButton
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              position: "absolute",
              top: 100,
              right: 30,
              zIndex: 1300,
              bgcolor: "primary.main",
              color: "white",
              transition: "0.3s ease-in-out",
              "&:hover": {
                bgcolor: "gray",
                color: "#fff",
                transform: "scale(1.1)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>

        {/* Sidebar Drawer (Right Side) */}
        <Drawer
          anchor="right"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              top: 81, // Adjust this value to move the sidebar down from the top
              height: "calc(100vh - 80px)",
              overflow: "scroll", // Ensures it doesn't extend beyond the viewport
            },
          }}
          ModalProps={{
            hideBackdrop: true, // Disables the dimming backdrop
          }}
        >
          <Box sx={{ width: 300, p: 2 }}>
            {/* Close Button */}

            {/* Filters Section */}
            <div className="flex flex-col space-y-4 mt-6 ">
              <SelectInput
                id="status"
                className="shadow-md"
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
                OtherClasses="shadow-md"
                label="Select Year(s)"
                value={year}
                setValue={handleYearChange}
                options={yearsJson}
                isMulti={Array.isArray(year)}
              />

              <SelectInput
                id="month"
                className="shadow-md"
                label="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                options={monthsJson}
                labelStyles={{ fontWeight: 500 }}
              />

              <SelectInput
                id="company"
                className="shadow-md"
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                options={[{ label: "All", value: "0" }, ...cps]}
                labelStyles={{ fontWeight: 500 }}
              />

              <SelectInput
                id="taskType"
                className="shadow-md"
                label="Task Type"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                options={[
                  { label: "All", value: "0" },
                  ...taskTypeOptions.options,
                ]}
                labelStyles={{ fontWeight: 500 }}
              />

              {taskType === "gst" && (
                <>
                  <SelectInput
                    id="filedStatus"
                    className="shadow-md"
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
                    ></textarea>
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
            </div>
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
};

export default Charts;




const ChartCard = ({ children, xs = 5, height = "auto" }) => (
  <Grid
    item
    xs={xs}
    sx={{
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      bgcolor: "white",
      marginTop: "0",
      height: height, // Set dynamic height
    }}
  >
    {children}
  </Grid>
);
