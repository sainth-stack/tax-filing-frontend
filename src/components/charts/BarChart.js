import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { base_url } from "../../const";
import Loader from "../helpers/loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
  // Define a set of colors for bars to ensure uniqueness and consistency
  const colors = [
    "#42A5F5",
    " #ff6385",
    "#FFA726",
    "#26C6DA",
    "#7E57C2",
    "#FF7043",
    "#26A69A",
    "#EC407A",
    "#AB47BC",
    "#FFCA28",
  ];

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Companies By Task Type",
        data: [],
        borderColor: "#29CC3F",
        borderWidth: 4,
        fill: true,
        lineTension: 0.5,
        pointRadius: 0, // Set the point radius to 0 to hide the dot
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(2, 5, 0, 200);
          gradient.addColorStop(0, "#29CC3F");
          gradient.addColorStop(0.8, "rgba(41, 204, 63, 0.2)");
          return gradient;
        },
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;
        setLoading(false);

        const companyCountsByTask = tasks.reduce((acc, task) => {
          const taskType = task.taskType;
          const companyName = task.companyName;

          if (!acc[taskType]) {
            acc[taskType] = {};
          }

          acc[taskType][companyName] = (acc[taskType][companyName] || 0) + 1;

          return acc;
        }, {});

        const labels = Object.keys(companyCountsByTask);
        const data = labels.map((taskType) =>
          Object.values(companyCountsByTask[taskType]).reduce(
            (sum, count) => sum + count,
            0
          )
        );

        // Use the predefined colors array to set unique colors for each bar
        const barColors = labels.map(
          (_, index) => colors[index % colors.length]
        );

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Companies",
              data: data,
              backgroundColor: barColors, // Set bar colors
              borderColor: "#1E88E5",
              borderWidth: 0.5,
              borderRadius: 5,
              fill: true,
              lineTension: 0.4,
              pointRadius: 0, // Set the point radius to 0 to hide the dot
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Task Types",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Companies",
        },
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1, // Ensure y-axis uses whole number steps
          callback: (value) => {
            return Number.isInteger(value) ? value : null; // Only display integers
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div
        className="bar_chart shadow-lg p-2"
        style={{
          width: "100%",
          height: "40vh",
        }}
      >
        {loading ? (
          <>
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              Loading...
            </h1>
            <div className="flex justify-center items-center p-4">
              <Loader size={30} />
            </div>
          </>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default BarChart;
