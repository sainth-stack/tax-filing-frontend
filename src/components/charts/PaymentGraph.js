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

ChartJS.register(

  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const TaskStatusGraph = ({ paymentGraphDetails, filterTime2, loading }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [taskDetails, setTaskDetails] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [filterTime, setFilterData] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', tasks: [] });

  useEffect(() => {
    let filtered = [...filterTime2]; // Ensure it starts with filterTime2

    if (type === "payment") {
      // Filter for tasks with GST monthly payments
      filtered = filterTime2.filter(
        (task) => task?.taskName === 'gstMonthlyPayment'
      );
    } else if (type === "filing") {
      // Filter for tasks with specific monthly payment tasks
      const paymentTaskNames = [
        'tdsTcsMonthly',
        'esiRegularMonthlyActivity',
        'gstMonthly',
        'pfMonthly'
      ];

      filtered = filterTime2.filter(
        (task) =>
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
        // Collect counts of completed and not completed tasks based on `actualCompletionDate`
        filterTime?.forEach((task) => {
          const taskType = task.taskType || "others";
          const isCompleted = isTaskCompleted(task)

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
              borderRadius: 5,
            },
            {
              label: "Not Completed",
              data: notCompletedData,
              backgroundColor: "#FF0000",
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
      }
    };

    fetchData();
  }, [filterTime]);

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
        tasks: selectedTasks
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
        <div className="bar_chart p-2" style={{
          width: "100%",
          height: "450px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "16px",
          position: "relative",
        }}>
          {loading ? (
            <div className="flex justify-center items-center m-2">
              <Loader />
            </div>
          ) : (
            <>
              <Header {...{
                title: "Monthly Filing/Payment status by task by company",
                handleExportAsCSV,
                handleExportAsPDF,
                payment: true,
                type,
                setType,
              }} />

              <div className="w-full">
                <div style={{ width: "auto", height: "340px" }}>
                  {chartData.labels.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <Bar data={chartData} options={options} />
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
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>
    </>
  );
};

export default TaskStatusGraph;
