import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { base_url } from "../../const";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskStatusGraph = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

        const taskTypes = [];
        const completedCounts = {};
        const notCompletedCounts = {};

        const getStatusForTaskType = (task) => {
          switch (task.taskType) {
            case "gst":
              return {
                filingStatus: task.gstMonthly_filingStatus || "Unknown",
                paymentStatus: task.gstMonthlyPayment_payment || "Unknown",
              };
            case "pf":
              return {
                filingStatus: task.pfMonthly_filingStatus || "Unknown",
                paymentStatus: "N/A",
              };
            case "tds":
              return {
                filingStatus: task.tdstcsMonthly_filingStatus || "Unknown",
                paymentStatus: task.tdsmonthly_paymentStatus || "Unknown",
              };
            case "incomeTax":
              return {
                filingStatus: task.taxMonthly_filingStatus || "Unknown",
                paymentStatus: task.taxmonthly_paymentStatus || "Unknown",
              };
            case "esi":
              return {
                filingStatus: task.esiMonthly_filingStatus || "Unknown",
                paymentStatus: "N/A",
              };
            case "professionalTax":
              return {
                filingStatus: task.pftMonthly_filingStatus || "Unknown",
                paymentStatus: "N/A",
              };
            default:
              return {
                filingStatus: "Unknown",
                paymentStatus: task.paymentStatus || "Unknown",
              };
          }
        };

        tasks.map((task) => {
          const taskType = task.taskType || "Unknown";
          const { filingStatus, paymentStatus } = getStatusForTaskType(task);

          if (!taskTypes.includes(taskType)) {
            taskTypes.push(taskType);
            completedCounts[taskType] = 0;
            notCompletedCounts[taskType] = 0;
          }

          if (filingStatus === "Completed" || paymentStatus === "paid") {
            completedCounts[taskType]++;
          } else {
            notCompletedCounts[taskType]++;
          }

          return null;
        });

        const completedData = taskTypes.map(
          (type) => completedCounts[type] || 0
        );
        const notCompletedData = taskTypes.map(
          (type) => notCompletedCounts[type] || 0
        );

        const chartData = {
          labels: taskTypes,
          datasets: [
            {
              label: "Completed",
              data: completedData,
              backgroundColor: "rgba( 0, 0, 255,0.75)",
            },
            {
              label: "Not Completed",
              data: notCompletedData,
              backgroundColor: "rgba(255, 0, 0, 0.75)",
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="bar_chart shadow-lg p-2 scrollable-element"
      style={{
        width: "100%",
        height: "40vh",
        overflow: "scroll",
      }}
    >
      <h2>Task Status Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar
          data={chartData}
          options={{
            indexAxis: "x", // Horizontal bars
            scales: {
              x: {
                stacked: true,
                ticks: {
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
              },
              y: {
                stacked: true,
                ticks: {
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                  callback: function (value) {
                    return value; // Display only numerical counts on y-axis
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
              },
              datalabels: {
                display: true,
                color: "white",
                anchor: "center",
                align: "center",
                formatter: (value) => value || "",
                font: {
                  size: 20,
                  weight: "bold",
                },
              },
            },
            responsive: true,
            maintainAspectRatio: true,
          }}
        />
      )}
    </div>
  );
};

export default TaskStatusGraph;
