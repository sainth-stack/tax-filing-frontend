import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { base_url } from "../../const";
import Loader from "../helpers/loader";

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${base_url}/companies/all`);
        const companies = response.data.data;
        setLoading(false);
        // Create a mapping of constitutions and their counts
        const combinationCounts = companies.reduce((acc, company) => {
          const { constitution, subConstitution } = company.companyDetails;
          console.log(constitution, subConstitution);
          let key = "";
          if (constitution === "Partnership") {
            key =
              subConstitution === "registered"
                ? "Partnership Registered"
                : "Partnership Unregistered";
          } else if (constitution === "Proprietorship") {
            key = "Proprietorship";
          } else if (constitution === "PrivateLimited") {
            key = "PrivateLimited";
          }

          if (key) {
            acc[key] = (acc[key] || 0) + 1;
          }

          return acc;
        }, {});

        const labels = Object.keys(combinationCounts);
        const data = Object.values(combinationCounts);
        const backgroundColor = labels.map((label, index) => {
          const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
          return colors[index % colors.length]; // Cycle through colors
        });
        console.log(data);
        // Set the state once with the processed data
        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor,
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error(
          "Error fetching data for the chart:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 10,
      },
    },
  };

  return (
    <div className="container">
      <div
        className="pie_chart shadow-lg p-4 flex justify-center w-fit"
        style={{
          width: "85%",
          height: "40vh",
        }}
      >
        {loading && loading ? (
          <>
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              {loading && loading ? "Loading..." : "Tax Filing "}
            </h1>
            <div className="flex justify-center items-center  p-4">
              <Loader size={30} />
            </div>
          </>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default PieChart;
