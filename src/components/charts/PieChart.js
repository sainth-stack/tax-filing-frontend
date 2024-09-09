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

        console.log(companies, "companies data");

        const combinationCounts = companies
          .map((company) => {
            const { constitution, subConstitution } = company.companyDetails;
            if (
              constitution === "Partnership" &&
              subConstitution === "registered"
            ) {
              return "Partnership Registered";
            } else if (constitution === "Proprietorship") {
              return "Proprietorship";
            } else if (constitution === "PrivateLimited") {
              return "PrivateLimited";
            } else if (
              constitution === "Partnership" &&
              subConstitution === "Unregistered"
            ) {
              return "Partnership Unregistered";
            }
            return null;
          })
          .filter((combination) => combination !== null)
          .reduce((acc, combination) => {
            acc[combination] = (acc[combination] || 0) + 1;
            return acc;
          }, {});

        const labels = [
          "Partnership Registered",
          "Proprietorship",
          "PrivateLimited",
          "Partnership Unregistered",
        ];
        const data = labels.map((label) => combinationCounts[label] || 0);

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });

        console.log("Chart data:", {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
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
        position: "bottom",
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
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
