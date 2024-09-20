import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import SelectInput from "../select";
import axios from "axios";
import { base_url } from "../../const";
import PaymentGraph from "./PaymentGraph";
import TasksGraph from "./PendingCompeltedTaksGraph";
import MeterGraph from "./MeterGraph";
import PendingCompeltedTaksGraph from "./PendingCompeltedTaksGraph";
import { monthsJson, yearsJson } from "./FilterData";
import moment from "moment/moment";

const Charts = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [companies, setCompanies] = useState([]);
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [clientStatuses, setClientStatuses] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          status: status === "all" ? "" : status,
          year,
          month
        });
        setLoading(false);

        const { data } = response;

        console.log("Chart company data", data);
        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          ...item,
          _id: item._id,
        }));

        const statusesArray = companyDetailsArray.map(
          ({ clientStatus }) => clientStatus
        );

        setCompanies(companyDetailsArray);
        setClientStatuses(statusesArray);

        console.log("global companies details", companies);
        // Log client statuses
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, [status, year, month]);

  const handleFilterChange = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${base_url}/tasks/filter`, {
        year,
        month,
      });

      setfilteredTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [year, month]);

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
      </div>

      <div className="grid grid-cols-2 gap-4  container">
        <PieChart companyDetails={companies} loading={loading} />
        <BarChart barDetails={companies} barloading={loading} />

        <PaymentGraph
          paymentGraphDetails={companies}
          filterTime={filteredTasks}
        />
        <MeterGraph
          MeterGraphDetails={companies}
          filteredTasks={filteredTasks}
        />
        <PendingCompeltedTaksGraph
          PendingCompeltedTaksGraphDetails={companies}
          filteredTasks={filteredTasks}
        />
      </div>
    </>
  );
};

export default Charts;
