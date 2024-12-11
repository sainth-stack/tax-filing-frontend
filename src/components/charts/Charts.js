import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import SelectInput from "../select";
import axios from "axios";
import { base_url } from "../../const";
import PaymentGraph from "./PaymentGraph";
import MeterGraph from "./MeterGraph";
import PendingCompeltedTaksGraph from "./PendingCompeltedTaksGraph";
import { applicationSubstatusOptions, monthsJson, taskTypeOptions, yearsJson } from "./FilterData";

const Charts = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [companies, setCompanies] = useState([]);
  const [taskType, setTaskType] = useState('0');
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [applicationSubStatus, setApplicationSubStatus] = useState('0');
  const [month, setMonth] = useState('0');
  const [year, setYear] = useState(new Date().getFullYear());
  const [cps, setcps] = useState([])
  const [company, setCompany] = useState('0');
  const user = JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          userId: user.role !== "A" ? user?._id : ''

        });
        setLoading(false);

        const { data } = response?.data;

        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          ...item,
          _id: item._id,
          label: item.companyDetails?.companyName,
          value: item.companyDetails?.companyName
        }));

        setcps(companyDetailsArray);

        // Log client statuses
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCompanies()
  }, [])
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          status: status === "all" ? "" : status,
          year,
          month: month === '0' ? '' : month,
          name: company === '0' ? '' : company,
          userId: user.role !== "A" ? user?._id : '',
          taskType: taskType !== "0" ? taskType : undefined,
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
  }, [status, year, month, company, taskType, applicationSubStatus]);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        year,
        month: month === '0' ? '' : month,
        company: company === '0' ? '' : company,
        user: user.role !== "A" ? user?._id : '',
        list: user.role !== "A" ? user?._id : '',
        taskType: taskType !== "0" ? taskType : undefined,
        applicationSubStatus: applicationSubStatus !== "0" ? applicationSubStatus : '',
      });

      const response = await axios.post(`${base_url}/tasks/auto/filter`, {
        year,
        month: month === '0' ? '' : month,
        company: company === '0' ? '' : company,
        user: user.role !== "A" ? user?._id : '',
        list: user.role !== "A" ? user?._id : '',
        taskType: taskType !== "0" ? taskType : undefined,
        applicationSubStatus: applicationSubStatus !== "0" ? applicationSubStatus : '',
      });
      const finData1 = response?.data?.tasks?.map((item) => {
        return {
          ...item, auto: true
        }
      })
      setfilteredTasks([...data?.data, ...finData1]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [year, month, company, taskType, applicationSubStatus]);


  return (
    <>
      <div className="flex items-center m-3 p-3">
        <SelectInput
          id="status"
          className="shadow-sm"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "inactive" },
          ]}
          labelStyles={{
            fontWeight: 500,
          }}
        />
        <SelectInput
          id="year"
          className="shadow-sm ml-2"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={yearsJson}
          labelStyles={{ fontWeight: 500 }}
        />
        <SelectInput
          id="month"
          className="shadow-sm ml-2"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={monthsJson}
          labelStyles={{ fontWeight: 500 }}
        />
        <SelectInput
          id="company"
          className="shadow-sm ml-2"
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          options={[{ label: 'All', value: '0' }, ...cps]}
          labelStyles={{ fontWeight: 500 }}
        />
        <SelectInput
          id="taskType"
          className="shadow-sm ml-2"
          label="Task Type"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          options={[{ label: 'All', value: '0' }, ...taskTypeOptions.options]}
          labelStyles={{ fontWeight: 500 }}
        />
        {taskType === 'gst' && <SelectInput
          id="applicationSubStatus"
          className="shadow-sm ml-2"
          label="Type of GST"
          value={applicationSubStatus}
          onChange={(e) => setApplicationSubStatus(e.target.value)}
          options={[{ label: 'All', value: '0' }, ...applicationSubstatusOptions]}
          labelStyles={{ fontWeight: 500 }}
        />}
      </div>

      <div className="grid grid-cols-2 gap-4  container">
        <PieChart companyDetails={companies} loading={loading} />
        <BarChart barDetails={companies} loading={loading} />
        <PaymentGraph
          paymentGraphDetails={companies}
          filterTime2={filteredTasks}
          loading={loading}
        />
        <MeterGraph
          MeterGraphDetails={companies}
          filteredTasks={filteredTasks}
          loading={loading}
        />
        <PendingCompeltedTaksGraph
          PendingCompeltedTaksGraphDetails={companies}
          filteredTasks={filteredTasks}
          loading={loading}

        />
      </div>
    </>
  );
};

export default Charts;
