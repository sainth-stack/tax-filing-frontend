import React, { useState, useEffect } from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import { base_url } from "./../../const";
import "./MeterGraph.css";
import { useNavigate } from "react-router";

const MeterGraph = () => {
  const [data, setData] = useState({
    overdue: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
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

        const categorizedTasks = tasks.reduce(
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

        console.log(categorizedTasks);

        console.log(categorizedTasks);

        setData({
          inProgress: categorizedTasks?.inProgress.length,
          overdue: categorizedTasks?.overdue.length,
          completed: categorizedTasks?.completed.length,
        });

        setTaskDetails(categorizedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  console.log("in porgess chein", taskDetails[selectedCategory]);
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: "450px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
        padding: "8px",
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
          const count = [data.overdue, data.inProgress, data.completed][index];

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
                  <br />
                  {/* <strong>Status:</strong>{" "}
                  {task.actualCompletionDate ? "Completed" : "In Progress"} */}
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
  );
};

export default MeterGraph;
