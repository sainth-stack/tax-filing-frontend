import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
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
import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import Header from "../../pages/Dashboard/card-container";

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

const PendingCompletedTasksGraph = ({ PendingCompeltedTaksGraphDetails, filteredTasks }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupContent, setPopupContent] = useState({ title: "", tasks: [] });
  const [tasksData, setTasksData] = useState({
    pendingTasksByPerson: {},
    completedTasksByPerson: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pendingTasksByPerson = {};
        const completedTasksByPerson = {};

        filteredTasks.forEach((task) => {
          const assignedTo = task.assignedTo || "Unassigned";
          const actualCompletionDate = task.actualCompletionDate
            ? new Date(task.actualCompletionDate)
            : null;

          if (actualCompletionDate) {
            if (!completedTasksByPerson[assignedTo]) {
              completedTasksByPerson[assignedTo] = { count: 0, tasks: [] };
            }
            completedTasksByPerson[assignedTo].count += 1;
            completedTasksByPerson[assignedTo].tasks.push(task);
          } else {
            if (!pendingTasksByPerson[assignedTo]) {
              pendingTasksByPerson[assignedTo] = { count: 0, tasks: [] };
            }
            pendingTasksByPerson[assignedTo].count += 1;
            pendingTasksByPerson[assignedTo].tasks.push(task);
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

              backgroundColor: "#FF0000",
            },
            {
              label: "Completed Tasks",
              data: labels.map(
                (label) => completedTasksByPerson[label]?.count || 0
              ),
              backgroundColor: "#008000", // Green for completed
            },
          ],
        };

        setTasksData({ pendingTasksByPerson, completedTasksByPerson });
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filteredTasks]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const assignedUser = chartData.labels[index];
      const datasetIndex = elements[0].datasetIndex;
      const isPendingTasks = datasetIndex === 0;
      const tasks = isPendingTasks
        ? tasksData.pendingTasksByPerson[assignedUser]?.tasks || []
        : tasksData.completedTasksByPerson[assignedUser]?.tasks || [];

      setPopupContent({
        title: `${isPendingTasks ? "Pending" : "Completed"
          } Tasks for ${assignedUser} (${tasks.length})`,
        tasks,
      });

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();
      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);
      setSelectedTasks(tasks);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks`, { state: { taskId } });
    setPopupVisible(false); // Hide the popup after navigation
  };

  const handleExportAsCSV = () => {
    const csvContent = chartData.labels
      .map((label, index) => {
        return `${label},${chartData.datasets[0].data[index]},${chartData.datasets[1].data[index]}`;
      })
      .join("\n");

    const blob = new Blob(
      [`Task Type,Completed,Not Completed\n${csvContent}`],
      {
        type: "text/csv;charset=utf-8;",
      }
    );
    saveAs(blob, "task_status.csv");
  };

  // Export as PDF
  const handleExportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Task Status Overview", 14, 16);

    const tableData = chartData.labels.map((label, index) => [
      label,
      chartData.datasets[0].data[index], // Completed count
      chartData.datasets[1].data[index], // Not Completed count
    ]);

    doc.autoTable({
      head: [["Task Type", "Completed", "Not Completed"]],
      body: tableData,
      startY: 30,
    });

    doc.save("task_status.pdf");
  };

  return (
    <>
      <div className="container">

        <div
          style={{
            width: "100%",
            height: "450px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            padding: "16px",
            position: "relative",
          }}
          className="mt-4"
        >
          <Header {...{ title: 'Tasks by Assignee', handleExportAsPDF, handleExportAsCSV }} />
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
                      type: "linear", // Ensure x-axis is linear to handle integer values
                      stacked: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        stepSize: 1, // Ensure the ticks are integers
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
                    {popupContent?.tasks?.length > 0 ? (
                      popupContent?.tasks?.map((task) => (
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
                              color: task.actualCompletionDate
                                ? "green"
                                : "red",
                            }}
                          >
                            Status:{" "}
                            {task.actualCompletionDate
                              ? "Completed"
                              : "Not Completed"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No tasks available</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PendingCompletedTasksGraph;
