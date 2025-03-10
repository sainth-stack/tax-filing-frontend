import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { base_url } from "../../const";
import { Switch } from "@mui/material"; // Import Switch from Material-UI

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

export const CustomSwitch = ({ checked, onChange }) => {
  console.log("cheked at ",checked)
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "inline-block",
        width: "48px",
        height: "23px",
        backgroundColor: checked ? "#1890ff" : "#E9E9EA",
        borderRadius: "15px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          width: "21px",
          height: "21px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: "1px",
          left: checked ? "25px" : "1px",
          transition: "left 0.3s",
        }}
      />
    </div>
  );
};



export const CustomLegendWithSwitch = ({ datasets ,setCompleted,complated}) => {

  const handleSwitchChange = () => {
    setCompleted(!complated);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      {datasets.map((dataset, index) => (
        <React.Fragment key={index}>
          <div
            style={{
              margin: "0 10px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor:
                  dataset.label === "Completed Tasks" ||
                  dataset.label === "Completed Payments"
                    ? "#008000"
                    : "#ff0000",
                width: "40px",
                height: "15px",
                display: "inline-block",
                marginRight: "5px",
              }}
            ></div>
            <span>{dataset.label}</span>
          </div>
          {index === 0 && (
            <CustomSwitch checked={complated} onChange={handleSwitchChange} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


const PendingCompletedTasksGraph = ({
  PendingCompeltedTaksGraphDetails,
  filteredTasks,
  loading,
  complated,
setCompleted
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

          if (actualCompletionDate && complated) {
            if (!completedTasksByPerson[assignedTo]) {
              completedTasksByPerson[assignedTo] = {
                count: 0,
                tasks: [],
                assignedName: assignedName,
              };
            }
            completedTasksByPerson[assignedTo].count += 1;
            completedTasksByPerson[assignedTo].tasks.push(task);
          } else if(!complated && !actualCompletionDate) {
            if (!pendingTasksByPerson[assignedTo]) {
              pendingTasksByPerson[assignedTo] = {
                count: 0,
                tasks: [],
                assignedName: assignedName,
              };
            }
            pendingTasksByPerson[assignedTo].count += 1;
            pendingTasksByPerson[assignedTo].tasks.push(task);
          }
        });

        const uniqueIds = [
          ...new Set([
            ...Object.keys(pendingTasksByPerson),
            ...Object.keys(completedTasksByPerson),
          ]),
        ].sort();

        const labels = uniqueIds.map((id) => nameMapping[id]);

        // Create a gradient background
        const createGradient = (ctx, color) => {
          const gradient = ctx.createLinearGradient(400, 0, 0, 0);
          gradient.addColorStop(0, color); // White at the top
          gradient.addColorStop(1, "#ffffff"); // Specified color at the bottom
          return gradient;
        };

        const ctx = document.createElement("canvas").getContext("2d");
        const data = {
          labels,
          datasets: [
            {
              label: "Completed Tasks",
              data: uniqueIds.map(
                (id) => completedTasksByPerson[id]?.count || 0
              ),
              backgroundColor: createGradient(ctx, "#008000"), // White to Green
            },
            {
              label: "Pending Tasks",
              data: uniqueIds.map((id) => pendingTasksByPerson[id]?.count || 0),
              backgroundColor: createGradient(ctx, "#ff0000"), // White to Red
            },
          ],
        };

        setTasksData({ pendingTasksByPerson, completedTasksByPerson });
        setChartData(data);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, [filteredTasks,complated]);

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
            height: "500px",
            // border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            padding: "16px",
            position: "relative",
          }}
          className=""
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
                <CustomLegendWithSwitch datasets={chartData.datasets} setCompleted={setCompleted} complated={complated}/>
                <div style={{ width: "auto", height: "380px" }}>

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
                            display:false,
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
                          display:false,
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
                            size: 16,
                            weight: "bold",
                          },
                        },
                      },
                      responsive: true,
                      maintainAspectRatio: true,
                    }}
                  />
                  </div>
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
