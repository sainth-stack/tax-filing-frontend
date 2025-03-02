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
import { Box, Drawer, Grid, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TaskProgressGaugePage from "./SemiCircle/TaskProgressGaugePage";
import RightSidebar from "../right-sidebar";

const Charts = () => {
  const currentYear = new Date().getFullYear();
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const [isHovered, setIsHovered] = React.useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");
  
  
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
    <Grid container width={"100%"}>
      {/* Center Content - Graphs */}
      <Grid
        item
        xs={12}
        // md={isSidebarOpen && !isMobile ? 10 : 12}
        sx={{
          transition: "all 0.3s ease-in-out",
          display:'flex',
           flexDirection:'row',
           gap:'6px'
        }}
      >
        <Grid container gap={1} sx={{width:isSidebarOpen ? "85%":'98%'}} >
          <ChartCard xs={isMobile ? 12 : isTablet ? 6 : 12}>
            <MeterGraph
              MeterGraphDetails={companies}
              filteredTasks={filteredTasks}
              loading={loading}
            />
          </ChartCard>
          <ChartCard xs={isMobile ? 12 : isTablet ? 6 : 5.95}>
            <PieChart companyDetails={companies} loading={loading} />
          </ChartCard>
          <ChartCard xs={isMobile ? 12 : isTablet ? 6 : 5.95}>
            <BarChart barDetails={companies} loading={loading} />
          </ChartCard>
          <ChartCard xs={isMobile ? 12 : isTablet ? 6 : 5.95}>
            <PaymentGraph
              paymentGraphDetails={companies}
              filterTime2={filteredTasks}
              loading={loading}
            />
          </ChartCard>
          <ChartCard xs={isMobile ? 12 : isTablet ? 6 : 5.95}>
            <PendingCompeltedTaksGraph
              PendingCompeltedTaksGraphDetails={companies}
              filteredTasks={filteredTasks}
              loading={loading}
            />
          </ChartCard>
        </Grid>
         <ChartCard xs={isSidebarOpen ? 2:0.5} sx={{padding:'0px 10px'}}>
           <RightSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isMobile={isMobile}
            status={status}
            setStatus={setStatus}
            year={year}
            handleYearChange={handleYearChange}
            yearsJson={yearsJson}
            month={month}
            setMonth={setMonth}
            monthsJson={monthsJson}
            company={company}
            setCompany={setCompany}
            cps={cps}
            taskType={taskType}
            setTaskType={setTaskType}
            taskTypeOptions={taskTypeOptions}
            filedStatus={filedStatus}
            handleFiledStatusChange={handleFiledStatusChange}
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
            reason={reason}
            setReason={setReason}
            applicationSubStatus={applicationSubStatus}
            setApplicationSubStatus={setApplicationSubStatus}
            applicationSubstatusOptions={applicationSubstatusOptions}
          />
        </ChartCard>
      </Grid>
    </Grid>
  );
};

export default Charts;




const ChartCard = ({ children, xs = 5, height = "auto" ,sx}) => (
  <Grid
    item
    xs={xs}
    sx={{
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      bgcolor: "white",
      marginTop: "0",
      height: height,
      cursor:"pointer",
      ...sx
    }}
  >
    {children}
  </Grid>
);
