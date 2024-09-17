import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { base_url } from "../../const";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const PendingCompletedTasksGraph = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

        const pendingTasksByPerson = {};
        const completedTasksByPerson = {};

        tasks.forEach((task) => {
          const assignedTo = task.assignedTo || "Unassigned";
          const actualCompletionDate = task.actualCompletionDate
            ? new Date(task.actualCompletionDate)
            : null;
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;

          if (actualCompletionDate && dueDate) {
            if (actualCompletionDate > dueDate) {
              pendingTasksByPerson[assignedTo] =
                (pendingTasksByPerson[assignedTo] || 0) + 1;
            } else {
              completedTasksByPerson[assignedTo] =
                (completedTasksByPerson[assignedTo] || 0) + 1;
            }
          }
        });

        // Create labels (list of unique assignedTo values)
        const labels = [
          ...new Set([ ...Object.keys(pendingTasksByPerson), ...Object.keys(completedTasksByPerson) ]),
        ].sort();

        const data = {
          labels,
          datasets: [
            {
              label: "Pending Tasks",
              data: labels.map((label) => pendingTasksByPerson[label] || 0),
              backgroundColor: "rgba(255, 99, 132, 0.8)", // Red for pending
            },
            {
              label: "Completed Tasks",
              data: labels.map((label) => completedTasksByPerson[label] || 0),
              backgroundColor: "rgba(75, 192, 192, 0.8)", // Green for completed
            },
          ],
        };

        setChartData(data);
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
      style={{
        position: "relative",
        width: "100%",
        height: "40vh",
        overflow: "auto",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
      className="shadow-lg mt-4"
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Tasks Overview by Person
      </h2>
      {loading ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>Loading...</p>
      ) : (
        <Bar
          data={chartData}
          options={{
            indexAxis: "y",
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false, // Hide grid lines
                },
                ticks: {
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                  color: "#333",
                },
              },
              y: {
                stacked: true,
                grid: {
                  display: false, // Hide grid lines
                },
                ticks: {
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                  color: "#333",
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
                  color: "#333",
                },
              },
              datalabels: {
                display: true,
                color: "white",
                anchor: "end",
                align: "top",
                formatter: (value) => value || "",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default PendingCompletedTasksGraph;
