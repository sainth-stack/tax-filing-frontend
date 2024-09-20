import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { base_url } from "../../const";
import Loader from "../helpers/loader";
import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ chartHeight, barDetails, barloading }) => {
  const colors = [
    "#42A5F5",
    "#ff6385",
    "#FFA726",
    "#26C6DA",
    "#7E57C2",
    "#FF7043",
    "#26A69A",
    "#EC407A",
    "#AB47BC",
    "#FFCA28",
  ];

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Companies By Task Type",
        data: [],
        borderColor: "#29CC3F",
        borderWidth: 4,
        fill: true,
        lineTension: 0.5,
        pointRadius: 0,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(2, 5, 0, 200);
          gradient.addColorStop(0, "#29CC3F");
          gradient.addColorStop(0.8, "rgba(41, 204, 63, 0.2)");
          return gradient;
        },
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [clickedCompanies, setClickedCompanies] = useState([]);
  const [clickedLabel, setClickedLabel] = useState("");
  const [companyGroupsByTask, setCompanyGroupByTask] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasksData = response.data.data;
        setLoading(false);

        const filteredTasks = tasksData.filter((task) =>
          barDetails.some((company) => company.companyName === task.company)
        );

        const companyCounts = filteredTasks.reduce((acc, task) => {
          const taskType = task.taskType;
          const TaskId = task._id;

          if (!acc[taskType]) {
            acc[taskType] = {};
          }

          acc[taskType][TaskId] = (acc[taskType][TaskId] || 0) + 1;

          return acc;
        }, {});

        const companyGroupsByTask = filteredTasks.reduce((acc, task) => {
          const taskType = task.taskType;
          const companyName = task.company;
          const TaskId = task._id;

          if (!acc[taskType]) {
            acc[taskType] = {
              ids: [],
              names: [],
              idsWithNames: [],
            };
          }

          acc[taskType].ids.push(TaskId);
          acc[taskType].names.push(companyName);
          acc[taskType].idsWithNames.push([TaskId, companyName]);

          return acc;
        }, {});

        setCompanyGroupByTask(companyGroupsByTask);

        const labels = Object.keys(companyCounts);
        const data = labels.map((taskType) =>
          Object.values(companyCounts[taskType]).reduce(
            (sum, count) => sum + count,
            0
          )
        );

        const barColors = labels.map(
          (_, index) => colors[index % colors.length]
        );

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Companies",
              data: data,
              backgroundColor: barColors,
              borderColor: "#1E88E5",
              borderWidth: 0.5,
              borderRadius: 5,
              fill: true,
              lineTension: 0.4,
              pointRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [barDetails]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      const companies = companyGroupsByTask[label]?.idsWithNames || [];

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();

      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      setClickedLabel(label);
      setClickedCompanies(companies);
      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);
    }
  };

  const options = {
    onClick: handleClick,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Task Types",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Companies",
        },
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
      },
    },
  };

  const handleCompanyClick = (taskId) => {
    alert(taskId);

    navigate("/tasks", { state: { taskId } });
  };

  //console.log("hey clicked", clickedCompanies);

  const handleExportAsCSV = () => {
    const csvContent = chartData.labels
      .map((label, index) => {
        return `${label},${chartData.datasets[0].data[index]}`;
      })
      .join("\n");

    const blob = new Blob([`Task Type,Number of Companies\n${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "task_types.csv");
  };

  // Export as PDF
  const handleExportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Company Details by Task Type", 14, 16);
    doc.autoTable({
      head: [["Task Type", "Number of Companies"]],
      body: chartData.labels.map((label, index) => [
        label,
        chartData.datasets[0].data[index],
      ]),
      startY: 30,
    });
    doc.save("task_types.pdf");
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div className="container">
      <Grid>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: "relative",
            left: "35rem",
            top: "2.5rem",
            zIndex: 1000,
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleExportAsCSV}>Export as CSV</MenuItem>
          <MenuItem onClick={handleExportAsPDF}>Export as PDF</MenuItem>
        </Menu>
      </Grid>
      <div
        className="bar_chart p-2"
        style={{
          width: "100%",
          position: "relative",
          height: chartHeight || "380px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "8px",
        }}
      >
        {loading ? (
          <>
            <div className="flex justify-center items-center p-4">
              <Loader size={30} />
            </div>
          </>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      {popupVisible && (
        <div
          style={{
            position: "absolute",
            top: popupPosition.y,
            left: popupPosition.x,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            padding: "12px",
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
            {clickedLabel}
          </div>

          {barloading ? (
            <>
              <div className="flex justify-center items-center p-4">
                <Loader size={30} />
              </div>
            </>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {clickedCompanies.map(([companyId, companyName], index) => (
                <li
                  key={companyId}
                  style={{
                    padding: "10px 12px",
                    borderBottom:
                      index !== clickedCompanies.length - 1
                        ? "1px solid #eee"
                        : "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  className="hover:bg-gray-100"
                  onClick={() => handleCompanyClick(companyId)} // Pass companyId on click
                >
                  <strong style={{ color: "#555" }}>Company:</strong>{" "}
                  <span style={{ color: "#007BFF" }}>{companyName}</span>
                </li>
              ))}
            </ul>
          )}

          <IconButton
            onClick={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CloseOutlined />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default BarChart;
