// components/TaskStatusGraph.js
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

        // Initialize objects to hold counts and task types
        const taskTypes = [];
        const completedCounts = {};
        const notCompletedCounts = {};

        // Process tasks and aggregate data
        tasks.forEach((task) => {
          const taskType = task.taskType || "Unknown";
          const paymentStatus = task.PaymentStatus || "Unknown"; // Updated field name

          // Collect unique task types
          if (!taskTypes.includes(taskType)) {
            taskTypes.push(taskType);
            completedCounts[taskType] = 0;
            notCompletedCounts[taskType] = 0;
          }

          // Count completed tasks based on actualCompletionDate
          if (task.actualCompletionDate) {
            completedCounts[taskType]++;
          }

          // Count not completed tasks based on paymentStatus
          if (paymentStatus !== "paid") {
            notCompletedCounts[taskType]++;
          }
        });

        // Ensure all task types are included
        taskTypes.forEach((type) => {
          if (!(type in completedCounts)) completedCounts[type] = 0;
          if (!(type in notCompletedCounts)) notCompletedCounts[type] = 0;
        });

        // Prepare data for the bar chart
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
              backgroundColor: "blue",
            },
            {
              label: "Not Completed",
              data: notCompletedData,
              backgroundColor: "red",
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
