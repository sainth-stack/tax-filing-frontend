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

const Charts = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [companies, setCompanies] = useState([]);
  const [clientStatuses, setClientStatuses] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${base_url}/companies/filter`, {
          status: status === "all" ? "" : status,
        });
        setLoading(false);

        const { data } = response;

        console.log("Chart company data", data);
        const companyDetailsArray = data.map((item) => ({
          ...item.companyDetails,
          _id: item._id,
        }));

        const statusesArray = companyDetailsArray.map(
          ({ clientStatus }) => clientStatus
        );

        setCompanies(companyDetailsArray);
        setClientStatuses(statusesArray);

        console.log("Clinet statuss ,pir", statusesArray);
        // Log client statuses
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, [status]);

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
      </div>

      <div className="grid grid-cols-2 gap-4  container">
        <PieChart companyDetails={companies} loading={loading} />
        <BarChart />
        <PaymentGraph />
        <MeterGraph />
        <PendingCompeltedTaksGraph />
      </div>
    </>
  );
};

export default Charts;
