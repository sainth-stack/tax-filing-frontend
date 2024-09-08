import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { base_url } from "../../const";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/companies/all`);
        const companies = response.data.data;

        console.log(companies, "companied data");
        const constitutionCount = companies
          .map((company) => company.companyDetails.constitution)
          .filter((type) => type === "Partnership").length;

        console.log("constitutionCount", constitutionCount);

        const subConstitutionCount = companies
          .map((company) => company.companyDetails.subConstitution)
          .filter((type) => type === "registered").length;

        console.log("subConstitutionCount", subConstitutionCount);

        setChartData({
          labels: ["Constitution", "SubConstitution"],
          datasets: [
            {
              data: [constitutionCount, subConstitutionCount],
              backgroundColor: ["#FF6384", "#36A2EB"],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            const total = chartData.datasets[0].data.reduce(
              (acc, val) => acc + val,
              0
            );
            return `${label}: ${value} (${((value / total) * 100).toFixed(
              2
            )}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div
        className="pie_chart shadow-lg p-4 flex justify-center w-fit"
        style={{
          width: "80%",
          height: "40vh",
        }}
      >
        <Pie data={chartData} className="flex" options={options} />
      </div>
    </div>
  );
};

export default PieChart;
