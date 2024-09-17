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
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupContent, setPopupContent] = useState("");

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
              backgroundColor: "rgba(0, 255, 0, 0.75)", // Green color for completed
            },
            {
              label: "Not Completed",
              data: notCompletedData,
              backgroundColor: "rgba(255, 0, 0, 0.75)", // Red color for not completed
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

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      const completedCount = chartData.datasets[0].data[index];
      const notCompletedCount = chartData.datasets[1].data[index];
      const content = `Completed: ${completedCount}, Not Completed: ${notCompletedCount}`;

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();

      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      setPopupContent(content);
      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);
    }
  };

  const options = {
    indexAxis: "x", // Horizontal bars
    onClick: handleClick, // Add click handler
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
          stepSize: 1, // Display integer values only
          callback: function (value) {
            return Number.isInteger(value) ? value : ''; // Ensure only integers are shown
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
  };
  

  return (
    <div className="bar_chart p-2" style={{
      width: "100%",
      height: "380px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      backgroundColor: "#fff",
      padding: "16px",
      position: "relative",
    }}>
      <h2 style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
        Task Status Overview
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
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
            maxHeight: "300px", // Limit the height of the popup
            overflowY: "auto", // Add scroll if content overflows
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
    </div>
  );
};

export default TaskStatusGraph;
