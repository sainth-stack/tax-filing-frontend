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
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 90, y: 0 });
  const [popupContent, setPopupContent] = useState("");
  const [tasksData, setTasksData] = useState([]);

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

          // Store entire task object
          if (actualCompletionDate && dueDate) {
            if (actualCompletionDate > dueDate) {
              pendingTasksByPerson[assignedTo] = {
                count: (pendingTasksByPerson[assignedTo]?.count || 0) + 1,
                tasks: [
                  ...(pendingTasksByPerson[assignedTo]?.tasks || []),
                  task,
                ], // Store all pending tasks
              };
            } else {
              completedTasksByPerson[assignedTo] = {
                count: (completedTasksByPerson[assignedTo]?.count || 0) + 1,
                tasks: [
                  ...(completedTasksByPerson[assignedTo]?.tasks || []),
                  task,
                ], // Store all completed tasks
              };
            }
          }
        });

        const labels = [
          ...new Set([
            ...Object.keys(pendingTasksByPerson),
            ...Object.keys(completedTasksByPerson),
          ]),
        ].sort();

        const data = {
          labels,
          datasets: [
            {
              label: "Pending Tasks",
              data: labels.map(
                (label) => pendingTasksByPerson[label]?.count || 0
              ),
              fontSize: "20",
              backgroundColor: "rgba(255, 0, 0, 0.75)",
            },
            {
              label: "Completed Tasks",
              data: labels.map(
                (label) => completedTasksByPerson[label]?.count || 0
              ),
              backgroundColor: "rgba(0, 255, 0, 0.75)", // Green for completed
            },
          ],
        };

        setTasksData({ pendingTasksByPerson, completedTasksByPerson }); // Store full task objects
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const assignedUser = chartData.labels[index];

      const datasetIndex = elements[0].datasetIndex;
      const isPendingTasks = datasetIndex === 0;
      const tasks = isPendingTasks
        ? tasksData.pendingTasksByPerson[assignedUser]?.tasks || []
        : tasksData.completedTasksByPerson[assignedUser]?.tasks || [];

      const content = `${isPendingTasks ? "Pending" : "Completed"}: ${
        tasks.length
      }`;

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();
      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      setPopupContent(content);
      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);

      // Set the selected task data for the clicked bar
      setSelectedTask({
        user: assignedUser,
        tasks: tasks, // Only store tasks for the clicked bar
      });
    }
    console.log("vishnu 5th dahsbaor", selectedTask);
    navigate("/tasks", { state: { selectedTask } });
  };

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
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Tasks Overview by Person
      </h2>
      {loading ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
          Loading...
        </p>
      ) : (
        <>
          <Bar
            data={chartData}
            options={{
              indexAxis: "y",
              onClick: handleClick,
              scales: {
                x: {
                  stacked: true,
                  weight: 20,
                  grid: {
                    display: false,
                  },

                  ticks: {
                    font: {
                      size: 10,
                      weight: "bold",
                    },
                    color: "#333",
                  },
                },
                y: {
                  stacked: true,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size: 14,

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
                  anchor: "center",

                  align: "center",

                  formatter: (value) => value || "",
                  font: {
                    size: 22,
                    weight: "bold",
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: true,
            }}
          />

          {popupVisible && (
            <div
              style={{
                position: "absolute",
                top: popupPosition.y,
                left: popupPosition.x,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
                padding: "16px",
                zIndex: 1000,
                width: "250px",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {popupContent}
              </div>

              <IconButton
                onClick={() => setPopupVisible(false)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  backgroundColor: "#f5f5f5",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "50%",
                  padding: "6px",
                }}
              >
                <CloseOutlined />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingCompletedTasksGraph;
