import React, { useState, useEffect } from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import { base_url } from "./../../const";
import "./MeterGraph.css";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

import { useNavigate } from "react-router";
import jsPDF from "jspdf"; // PDF export
import "jspdf-autotable"; // Required for table formatting
import { Grid, IconButton, Menu, MenuItem } from "@mui/material";

const MeterGraph = ({ MeterGraphDetails }) => {
  const [data, setData] = useState({
    overdue: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [taskDetails, setTaskDetails] = useState({
    overdue: [],
    inProgress: [],
    completed: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

        const filteredTasks = tasks.filter((task) =>
          MeterGraphDetails.some(
            (company) => company.companyName === task.company
          )
        );

        const categorizedTasks = filteredTasks.reduce(
          (acc, task) => {
            const dueDate = new Date(task.dueDate);
            const actualCompletionDate = task.actualCompletionDate
              ? new Date(task.actualCompletionDate)
              : null;

            if (actualCompletionDate) {
              if (actualCompletionDate <= dueDate) {
                acc.completed.push(task);
              } else {
                acc.overdue.push(task);
              }
            } else {
              acc.inProgress.push(task);
            }
            return acc;
          },
          { completed: [], inProgress: [], overdue: [] }
        );

        setData({
          inProgress: categorizedTasks.inProgress.length,
          overdue: categorizedTasks.overdue.length,
          completed: categorizedTasks.completed.length,
        });

        setTaskDetails(categorizedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [MeterGraphDetails]);

  if (loading) return <div>Loading...</div>;

  const totalTasks = data.completed + data.inProgress + data.overdue;
  const categories = [];
  const colors = [];

  if (data.overdue > 0) {
    categories.push(data.overdue / totalTasks);
    colors.push("#FF0000");
  }
  if (data.inProgress > 0) {
    categories.push(data.inProgress / totalTasks);
    colors.push("#FFBF00");
  }
  if (data.completed > 0) {
    categories.push(data.completed / totalTasks);
    colors.push("#008000");
  }

  const averagePercentage = categories.reduce((acc, val) => acc + val, 0);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks`, { state: { taskId } });
  };

  // Export CSV
  // Export CSV
  // Export CSV
  const exportToCSV = () => {
    const fields = ["Task Name", "Task Type", "Status"];
    const allTasks = [
      ...taskDetails.completed.map((task) => ({
        ...task,
        status: "Completed",
      })),
      ...taskDetails.inProgress.map((task) => ({
        ...task,
        status: "In Progress",
      })),
      ...taskDetails.overdue.map((task) => ({ ...task, status: "Overdue" })),
    ];

    if (allTasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    const csvContent = [
      fields.join(","), // header
      ...allTasks.map((task) =>
        [task.taskName, task.taskType, task.status].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `all_tasks.csv`);
    link.click();
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const allTasks = [
      ...taskDetails.completed.map((task) => ({
        ...task,
        status: "Completed",
      })),
      ...taskDetails.inProgress.map((task) => ({
        ...task,
        status: "In Progress",
      })),
      ...taskDetails.overdue.map((task) => ({ ...task, status: "Overdue" })),
    ];

    if (allTasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    doc.text("All Tasks", 10, 10);

    doc.autoTable({
      head: [["Task Name", "Task Type", "Status"]],
      body: allTasks.map((task) => [task.taskName, task.taskType, task.status]),
    });

    doc.save(`all_tasks.pdf`);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
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
            <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
            <MenuItem onClick={exportToPDF}>Export as PDF</MenuItem>
          </Menu>
        </Grid>

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
          className="overflow-auto scrollable-element"
        >
          <div className="mt-6 m-2">
            <GaugeChart
              id="gauge-chart"
              nrOfLevels={categories.length || 1}
              percent={averagePercentage}
              textColor="#000"
              fontSize="20px"
              colors={colors}
              arcWidth={0.3}
              needleColor="#000000"
              arcPadding={0.01}
              needleBaseColor="#000000"
              needleShadowColor="#000000"
            />
          </div>

          {/* Category Labels */}
          <div className="labels-overlay">
            {["overdue", "inProgress", "completed"].map((label, index) => {
              const count = [data.overdue, data.inProgress, data.completed][
                index
              ];

              return count > 0 ? (
                <div
                  key={index}
                  className="label"
                  onClick={() => handleCategoryClick(label)}
                >
                  <div>
                    <h6>{`${label}: ${count}`}</h6>
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Popup for Selected Category */}
          {selectedCategory && (
            <div
              style={{
                position: "absolute",
                top: "70px",
                right: "10px",
                backgroundColor: "#fff",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                maxHeight: "80vh",
                overflowY: "auto",
                width: "300px",
                zIndex: 1000,
              }}
              className="container shadow-md"
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: "0" }}>{selectedCategory}</h3>
                <button
                  onClick={() => setSelectedCategory("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Task List */}
              <ul
                style={{
                  listStyle: "none",
                  padding: "0",
                  margin: "10px 0 0 0",
                }}
              >
                {(taskDetails[selectedCategory] || []).length > 0 ? (
                  taskDetails[selectedCategory].map((task) => (
                    <li
                      key={task._id}
                      onClick={() => handleTaskClick(task._id)}
                      style={{
                        padding: "5px 0",
                        borderBottom: "1px solid #ddd",
                        margin: "1px 3px",
                        cursor: "pointer",
                      }}
                    >
                      <strong>Name:</strong> {task.taskName}
                      <br />
                      <strong>Type:</strong> {task.taskType}
                    </li>
                  ))
                ) : (
                  <li style={{ padding: "10px", textAlign: "center" }}>
                    No tasks found.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MeterGraph;
