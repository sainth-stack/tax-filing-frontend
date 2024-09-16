import React, { useState, useEffect } from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import { base_url } from "./../../const";
import "./MeterGraph.css";
import { type } from "@testing-library/user-event/dist/type";

const MeterGraph = () => {
  const [data, setData] = useState({
    inProgress: 0,
    overdue: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [taskDetails, setTaskDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/tasks/all`);
        const tasks = response.data.data;

        const categorizedTasks = tasks.reduce(
          (acc, task) => {
            const dueDate = new Date(task.dueDate);
            const startDate = new Date(task.startDate);
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
  }, []);

  if (loading) return <div>Loading...</div>;

  const totalTasks = data.completed + data.inProgress + data.overdue;

  const categories = [];
  const colors = [];

  if (data.overdue > 0) {
    categories.push(data.overdue / totalTasks);
    colors.push("#FF0000");
    if (data.inProgress > 0) {
      categories.push(data.inProgress / totalTasks);
      colors.push("#FFBF00");
    }
  }
  if (data.completed > 0) {
    categories.push(data.completed / totalTasks);
    colors.push("#008000");
  }

  const averagePercentage = categories.reduce((acc, val) => acc + val, 0);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "40vh" }}
      className="shadow-lg mt-4 overflow-auto scrollable-element"
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
          formatTextValue={""}
          needleShadowColor="#000000"
        />
      </div>
      <div className="labels-overlay">
        {["Overdue", "In Progress", "Completed"].map((label, index) => {
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: "0" }}>{selectedCategory}</h3>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              onClick={() => setSelectedCategory("")}
            >
              &times;
            </button>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "10px 0 0 0",
            }}
          >
            {(
              taskDetails[selectedCategory.toLowerCase().replace(" ", "")] || []
            ).length > 0 ? (
              taskDetails[selectedCategory.toLowerCase().replace(" ", "")].map(
                (task) => (
                  <li
                    key={task._id}
                    style={{
                      padding: "5px 0",
                      borderBottom: "1px solid #ddd",
                      margin: "1px 3px",
                    }}
                  >
                    {task.taskType}
                    {/* Ensure this is the field you want to display */}
                  </li>
                )
              )
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
