import React, { useState, useEffect } from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import { base_url } from "./../../const";
import "./MeterGraph.css";

import { useNavigate } from "react-router";
import jsPDF from "jspdf"; // PDF export
import "jspdf-autotable"; // Required for table formatting
import Header from "../../pages/Dashboard/card-container";
import Loader from "../helpers/loader";
import NoDataFound from "./NoDataFound";

const MeterGraph = ({ MeterGraphDetails, filteredTasks, loading }) => {
  const [data, setData] = useState({
    overdue: 0,
    inProgress: 0,
    completed: 0,
  });
  // Default to 50% or other initial value

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filteredTasks]);

  const categories = [];
  const colors = [];
  const labelColors = ["#ff0000", "#ffcf57", "#008000"];

  if (data.overdue > 0) {
    categories.push(data.overdue);
    colors.push("#ff0000"); // Hex code for red
  }

  if (data.inProgress > 0) {
    categories.push(data.inProgress);
    colors.push("#ffcf57"); // Hex code for yellow
  }

  if (data.completed > 0) {
    categories.push(data.completed);
    colors.push("#008000"); // Hex code for green
  }


  const completedCategories = categories[2];

  const totalCategories = categories[0] + categories[1] + categories[2];
  const averagePercentage =
    totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 1;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks`, { state: { taskId } });
  };

  // Export CSV
  // Export CSV
  // Export CSV
  const handleExportAsCSV = () => {
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
  const handleExportAsPDF = () => {
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
          className="overflow-auto scrollable-element"
        >
          {loading ? (
            <>
              <div className="flex justify-center   items-center m-2">
                <Loader />
              </div>
            </>
          ) : (
            <>
              <Header
                {...{ title: "Tasks Due Date" }}
                handleExportAsCSV={handleExportAsCSV}
                handleExportAsPDF={handleExportAsPDF}
              />
              {categories.length === 0 ? (
                <NoDataFound />
              ) : (
                <>
                  <div className="mt-10 m-2" style={{ position: "relative" }}>
                    <GaugeChart
                      id="gauge-chart"
                      nrOfLevels={(categories && categories.length) || 1}
                      percent={
                        parseFloat((averagePercentage / 100).toFixed(1)) || 0
                      }
                      textColor="#000"
                      fontSize="20px"
                      colors={colors}
                      arcWidth={0.3}
                      needleColor="#000000"
                      arcPadding={0.01}
                      needleBaseColor="#000000"
                      needleShadowColor="#000000"
                      formatTextValue={(averagePercentage) => `${averagePercentage}%`}
                    />
                    {data?.overdue && data.overdue > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "45%",
                          left: "23%",
                          color: "#FFF",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {data.overdue && data?.overdue}
                      </div>
                    )}
                    {data?.inProgress && data.inProgress > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12%",

                          left: "48%",
                          color: "#fff",
                          fontSize: "30px",

                          fontWeight: 500,
                        }}
                      >
                        {data.inProgress && data?.inProgress}
                      </div>
                    )}
                    {data?.completed && data?.completed > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "45%",
                          right: "23%",
                          color: "#FFF",
                          fontSize: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {data?.completed}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "10%",
                        left: "-40px",
                      }}
                    >

                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className="labels-overlay">

            {["overdue", "inProgress", "completed"].map((label, index) => {
              const count = [data.overdue, data.inProgress, data.completed][
                index
              ];
              const backgroundColor = labelColors[index];

              return count > 0 ? (
                <div
                  key={index}
                  className="label"
                  onClick={() => handleCategoryClick(label)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Color indicator */}
                    <div
                      style={{
                        backgroundColor: backgroundColor, // Apply color here
                        width: "2.2rem",
                        height: ".8rem",
                        marginRight: "10px"
                      }}
                    />
                    <h6> {label}: {count}</h6>
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
