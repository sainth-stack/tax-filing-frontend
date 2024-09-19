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
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const TaskStatusGraph = ({ paymentGraphDetails, filterTime }) => {
  console.log("filter time", filterTime);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupContent, setPopupContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasksData = response.data.data;

        // Assuming `barDetails` is defined and contains company information
        const filteredTasks = tasksData.filter((task) =>
          paymentGraphDetails.some(
            (company) => company.companyName === task.company
          )
        );

        setTasks(filteredTasks); // Set filtered tasks here

        const taskTypes = [];
        const completedCounts = {};
        const notCompletedCounts = {};

        // Collect counts of completed and not completed tasks based on `actualCompletionDate`
        filteredTasks.forEach((task) => {
          const taskType = task.taskType || "Unknown";
          const isCompleted = task.actualCompletionDate !== null;

          if (!taskTypes.includes(taskType)) {
            taskTypes.push(taskType);
            completedCounts[taskType] = 0;
            notCompletedCounts[taskType] = 0;
          }

          if (isCompleted) {
            completedCounts[taskType]++;
          } else {
            notCompletedCounts[taskType]++;
          }
        });

        const completedData = taskTypes.map(
          (type) => completedCounts[type] || 0
        );
        const notCompletedData = taskTypes.map(
          (type) => notCompletedCounts[type] || 0
        );

        setChartData({
          labels: taskTypes,
          datasets: [
            {
              label: "Completed",
              data: completedData,
              backgroundColor: "#008000",
            },
            {
              label: "Not Completed",
              data: notCompletedData,
              backgroundColor: "#FF0000",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentGraphDetails]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      const index = elements[0].index;
      const label = chartData.labels[index];

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();

      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      // Determine whether the user clicked on the "Completed" or "Not Completed" section
      const isCompletedSection = datasetIndex === 0; // Index 0 is for "Completed"
      const isNotCompletedSection = datasetIndex === 1; // Index 1 is for "Not Completed"

      let selectedTasks = [];

      if (isCompletedSection) {
        selectedTasks = tasks.filter(
          (task) =>
            task.taskType === label && task.actualCompletionDate !== null
        );
      } else if (isNotCompletedSection) {
        selectedTasks = tasks.filter(
          (task) =>
            task.taskType === label && task.actualCompletionDate === null
        );
      }

      setTaskDetails(selectedTasks);
      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks`, { state: { taskId } });
    setPopupVisible(false); // Hide the popup after navigation
  };

  const options = {
    indexAxis: "x",
    onClick: handleClick,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { size: 16, weight: "bold" },
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { size: 16, weight: "bold" },
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14, weight: "bold" } },
      },
      datalabels: {
        display: true,
        color: "white",
        anchor: "center",
        align: "center",
        formatter: (value) => value || "",
        font: { size: 20, weight: "bold" },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div
      className="bar_chart p-2"
      style={{
        width: "100%",
        height: "450px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
        padding: "16px",
        position: "relative",
      }}
    >
      <h2
        style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}
      >
        Task Status Overview
      </h2>
      {loading ? <p>Loading...</p> : <Bar data={chartData} options={options} />}
      {popupVisible && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 100,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            padding: "16px",
            zIndex: 1000,
            width: "250px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              borderRadius: "50%",
            }}
          >
            <CloseOutlined />
          </IconButton>

          <div>
            {taskDetails.length > 0 ? (
              taskDetails.map((task) => (
                <div
                  key={task._id}
                  onClick={() => handleTaskClick(task._id)} // Task click handler
                  style={{
                    marginBottom: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    backgroundColor: "#f5f5f5",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e0e0e0")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                >
                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {task.taskName || "No Name"}
                  </h4>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    Task Type: {task.taskType || "Unknown"}
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: task.actualCompletionDate ? "green" : "red",
                    }}
                  >
                    Status:{" "}
                    {task.actualCompletionDate ? "Completed" : "Not Completed"}
                  </p>
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStatusGraph;
