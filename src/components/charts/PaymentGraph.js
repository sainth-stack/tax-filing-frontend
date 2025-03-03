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

import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Header from "../../pages/Dashboard/card-container";
import Loader from "../helpers/loader";
import NoDataFound from "./NoDataFound";
import { isTaskCompleted } from "../../utils/const";
import TaskDetailsPopup from "../common/TaskDetailsPopup";
import { ThirdGraphColumns } from "../Export/data";
import { CustomLegendWithSwitch } from "./PendingCompeltedTaksGraph";

ChartJS.register(

  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const TaskStatusGraph = ({
  paymentGraphDetails,
  filterTime2,
  loading,
  setCompleted,
  complated,
}) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [taskDetails, setTaskDetails] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [filterTime, setFilterData] = useState([]);
  const [popupContent, setPopupContent] = useState({
    title: "",
    tasks: [],
    companies: [],
  });

  useEffect(() => {
    let filtered = [...filterTime2]; // Ensure it starts with filterTime2

    if (type === "payment") {
      // Filter for tasks with GST monthly payments
      filtered = filterTime2.filter(
        (task) => task?.taskName === "gstMonthlyPayment"
      );
    } else if (type === "filing") {
      // Filter for tasks with specific monthly payment tasks
      const paymentTaskNames = [
        "tdsTcsMonthly",
        "esiRegularMonthlyActivity",
        "gstMonthly",
        "pfMonthly",
      ];

      filtered = filterTime2.filter((task) =>
        paymentTaskNames.includes(task?.taskName)
      );
    }

    setFilterData(filtered);
  }, [type, filterTime2]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskTypes = [];
        const completedCounts = {};
        const notCompletedCounts = {};

        // Collect counts of completed and not completed tasks
        filterTime?.forEach((task) => {
          const taskType = task.taskType || "others";
          const isCompleted = isTaskCompleted(task);

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

        // Create a gradient background
        const createGradient = (ctx, color) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, color); // White at the top
          gradient.addColorStop(1, "#ffffff"); // Specified color at the bottom
          return gradient;
        };

        const ctx = document.createElement("canvas").getContext("2d");
        const data = {
          labels: taskTypes,
          datasets: [
            
               {
                  label: "Completed Payments",
                  data:complated ? completedData:[],
                  backgroundColor: createGradient(ctx, "#008000"), 
                  borderRadius: 2,
                  barPercentage: 0.6,
                },
              {
                  label: "Not Completed",
                  data: complated?[]:notCompletedData,
                  backgroundColor: createGradient(ctx, "#ff0000"), 
                  borderRadius: 2,
                  barPercentage: 0.6,
                },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, [filterTime, complated]);

  // console.log("3rd graph grpah  checking", filterTime2);
  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      const index = elements[0].index;
      const label = chartData.labels[index];
      const status = datasetIndex === 0 ? "Completed" : "Not Completed";

      let selectedTasks = [];
      if (datasetIndex === 0) {
        selectedTasks = filterTime?.filter(
          (task) => task?.taskType === label && isTaskCompleted(task)
        );
      } else {
        selectedTasks = filterTime?.filter(
          (task) => task?.taskType === label && !isTaskCompleted(task)
        );
      }

      setPopupContent({
        title: `${status} Tasks - ${label}`,
        tasks: selectedTasks,
        companies: paymentGraphDetails,
      });
      setPopupVisible(true);
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
          display: false,
          font: { size: 16, weight: "bold" },
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: { font: { size: 14, weight: "bold" } },
      },
      datalabels: {
        display: true,
        color: "white",
        anchor: "center",
        align: "center",
        formatter: (value) => value || "",
        font: { size: 16, weight: "bold" },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  // Export as PDF
  console.log("chartdata datasets", chartData.datasets);

  return (
    <>
      <div className="container">
        <div
          className="bar_chart p-2"
          style={{
            width: "100%",
            height: "480px",
            // border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            padding: "16px",
            position: "relative",
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center m-2">
              <Loader />
            </div>
          ) : (
            <>
              <Header
                data={filterTime2}
                columns={ThirdGraphColumns}
                {...{
                  title: "Monthly Tasks",

                  payment: true,
                  type,
                  setType,
                }}
              />

              <div className="w-full">
                <div style={{ width: "auto", height: "380px" }}>
                  {chartData.labels.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <>
                      <CustomLegendWithSwitch
                        datasets={chartData?.datasets}
                        setCompleted={setCompleted}
                        complated={complated}
                      />
                      <Bar data={chartData} options={options} />
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <TaskDetailsPopup
            visible={popupVisible}
            onClose={() => setPopupVisible(false)}
            title={popupContent.title}
            tasks={popupContent.tasks}
            companies={popupContent.companies}
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>
    </>
  );
};

export default TaskStatusGraph;
