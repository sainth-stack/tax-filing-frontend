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
import Loader from "../helpers/loader";
import NoDataFound from "./NoDataFound";
import { isTaskCompleted } from "../../utils/const";
import TaskDetailsPopup from "../common/TaskDetailsPopup";
import { columns, FourthGraphColumns } from "../Export/data";

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

const PendingCompletedTasksGraph = ({
  PendingCompeltedTaksGraphDetails,
  filteredTasks,
  loading,
}) => {


  // console.log("4th graph deatis",PendingCompeltedTaksGraphDetails)
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
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
        const pendingTasksByPerson = {};
        const completedTasksByPerson = {};
        const nameMapping = {};

        filteredTasks.forEach((task) => {
          const assignedTo = task.assignedTo || "Unassigned";
          const assignedName = task.assignedName || "Unassigned";
          nameMapping[assignedTo] = assignedName;

          const actualCompletionDate = (task?.actualCompletionDate || task?.pfMonthly_filedate || task?.esi_fileDate || task?.pft_fileDate || task?.gstMonthly_filedate || task?.tdsmonthly_paidDate || task?.paymentStatus=='completed')
            ? new Date((task?.actualCompletionDate || task?.pfMonthly_filedate || task?.esi_fileDate || task?.pft_fileDate || task?.gstMonthly_filedate || task?.tdsmonthly_paidDate || task?.paymentStatus=='completed'))
            : null;

          if (actualCompletionDate) {
            if (!completedTasksByPerson[assignedTo]) {
              completedTasksByPerson[assignedTo] = { count: 0, tasks: [], assignedName: assignedName };
            }
            completedTasksByPerson[assignedTo].count += 1;
            completedTasksByPerson[assignedTo].tasks.push(task);
          } else {
            if (!pendingTasksByPerson[assignedTo]) {
              pendingTasksByPerson[assignedTo] = { count: 0, tasks: [], assignedName: assignedName };
            }
            pendingTasksByPerson[assignedTo].count += 1;
            pendingTasksByPerson[assignedTo].tasks.push(task);
          }
        });

        const uniqueIds = [...new Set([
          ...Object.keys(pendingTasksByPerson),
          ...Object.keys(completedTasksByPerson),
        ])].sort();

        const labels = uniqueIds.map(id => nameMapping[id]);

        const data = {
          labels,
          datasets: [
            {
              label: "Completed Tasks",
              data: uniqueIds.map(
                (id) => completedTasksByPerson[id]?.count || 0
              ),
              backgroundColor: "#008000",
            },
            {
              label: "Pending Tasks",
              data: uniqueIds.map(
                (id) => pendingTasksByPerson[id]?.count || 0
              ),
              backgroundColor: "#FF0000",
            }
          ],
        };

        setTasksData({ pendingTasksByPerson, completedTasksByPerson });
        setChartData(data);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, [filteredTasks]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const uniqueIds = [...new Set([
        ...Object.keys(tasksData.pendingTasksByPerson),
        ...Object.keys(tasksData.completedTasksByPerson),
      ])].sort();

      const assignedId = uniqueIds[index];
      const assignedName = chartData.labels[index];
      const datasetIndex = elements[0].datasetIndex;
      const isPendingTasks = datasetIndex === 1;

      const tasks = isPendingTasks
        ? tasksData.pendingTasksByPerson[assignedId]?.tasks || []
        : tasksData.completedTasksByPerson[assignedId]?.tasks || [];

      setPopupContent({
        title: `${isPendingTasks ? "Pending" : "Completed"} Tasks for ${assignedName} (${tasks.length})`,
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

  const handleTaskClick = (taskId, auto) => {
    if (auto) {
      navigate(`/tasks/auto`, { state: { taskId } });
    } else {
      navigate(`/tasks`, { state: { taskId } });
    }
    setPopupVisible(false);
  };

  

  // Export as PDF
  

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
          {loading ? (
            <div className="flex justify-center   items-center m-2">
              <Loader />
            </div>
          ) : (
            <>
              <Header
                // columns={columns}
                  data={filteredTasks}
                columns={FourthGraphColumns}
                {...{
                  title: "Tasks by Assignee",
                }}
              />

              {chartData.labels.length === 0 ? (
                <NoDataFound />
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
                </>
              )}
              <TaskDetailsPopup
                visible={popupVisible}
                onClose={() => setPopupVisible(false)}
                title={popupContent.title}
                tasks={popupContent.tasks}
                onTaskClick={handleTaskClick}
                companies={PendingCompeltedTaksGraphDetails}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PendingCompletedTasksGraph;
