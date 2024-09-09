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
        label: "Number of Companies By Task Type",
        data: [],
        borderColor: '#29CC3F',
        borderWidth: 4,
        fill: true,
        lineTension: 0.5,
        pointRadius: 0, // Set the point radius to 0 to hide the dot
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, '#29CC3F');
          gradient.addColorStop(0.8, 'rgba(41, 204, 63, 0.2)');
          return gradient;
        },
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

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
              borderWidth: 0.5,
              borderRadius:5,
              fill: true,
              lineTension: 0.4,
              pointRadius: 0, // Set the point radius to 0 to hide the dot
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Task Types",
  //       },
  //     },
  //     y: {
  //       beginAtZero: true,
  //       title: {
  //         display: true,
  //         text: "Number of Companies",
  //       },
  //       /* ticks: {
  //         callback: (value) => {
  //           return Number.isInteger(value) ? value : value.toFixed(0);
  //         },
  //       }, */
  //     },
  //   },
  // };


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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;