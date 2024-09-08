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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Companies",
        data: [],
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

        console.log("Tasks data", tasks);
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

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Companies",
              data: data,
              backgroundColor: "#42A5F5",
              borderColor: "#1E88E5",
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
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Task Types",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Companies",
        },
        /* ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? value : value.toFixed(0);
          },
        }, */
      },
    },
  };

  return (
    <div className="container">
      <div
        className="bar_chart shadow-lg p-4"
        style={{
          width: "80%",
          height: "40vh",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
