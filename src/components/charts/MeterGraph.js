import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, text } from "recharts"; // Import from recharts
import { base_url } from "./../../const";
import "./MeterGraph.css";
import { useNavigate } from "react-router";
import jsPDF from "jspdf"; // PDF export
import "jspdf-autotable"; // Required for table formatting
import Header from "../../pages/Dashboard/card-container";
import Loader from "../helpers/loader";
import NoDataFound from "./NoDataFound";
import TaskDetailsPopup from "../common/TaskDetailsPopup";
import { columns, FourthGraphColumns, ThirdGraphColumns } from "../Export/data";
import { m } from "framer-motion";

// Reusable PieChart Component
// Reusable PieChart Component
const CustomGaugeChart = ({ value, total, label, color, onClick }) => {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;

  return (
    <div
      tabIndex={-1}  // 🔹 Prevent focus on wrapper div
      style={{ outline: "none" }}  // 🔹 Remove outline on wrapper
      onClick={onClick}  // 🔹 Handle click event
    >
      <PieChart
      width={300}
        height={150}
        style={{ cursor: "pointer" }}  // 🔹 Set pointer cursor
      >
        <text
          x={170}
          y={20}
          textAnchor="middle"
          style={{ fontSize: 18, fill: "#000", fontWeight: 600 }}
        >
          {label}
        </text>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={[
            { name: "Filled", value: value, color },
            { name: "Remaining", value: total - value, color: "#d3d3d3" },
          ]}
          cx={150}
          cy={150}
          innerRadius={80}
          outerRadius={120}
          stroke="none"
          style={{ pointerEvents: "none" }}  // 🔹 Prevent focus on Pie
        >
          <Cell key="filled" fill={color} />
          <Cell key="remaining" fill="#d3d3d3" />
        </Pie>
        <text
          x={150}
          y={150}
          textAnchor="middle"
          style={{ fontSize: 18, fill: "#000", fontWeight: 400 }}
        >
          {percentage}%
        </text>
      </PieChart>
    </div>
  );
};


const MeterGraph = ({ MeterGraphDetails, filteredTasks, loading }) => {
  const [data, setData] = useState({
    overdue: 0,
    inProgress: 0,
    completed: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [taskDetails, setTaskDetails] = useState({
    overdue: [],
    inProgress: [],
    completed: [],
  });
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", tasks: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorizedTasks = filteredTasks.reduce(
          (acc, task) => {
            const dueDate = new Date(task.dueDate);
            const actualCompletionDate =
              task?.actualCompletionDate ||
              task?.pfMonthly_filedate ||
              task?.esi_fileDate ||
              task?.pft_fileDate ||
              task?.gstMonthly_filedate
                ? new Date(
                    task?.actualCompletionDate ||
                      task?.pfMonthly_filedate ||
                      task?.esi_fileDate ||
                      task?.pft_fileDate ||
                      task?.gstMonthly_filedate
                  )
                : null;

            if (actualCompletionDate) {
              acc.completed.push(task);
            } else if (
              new Date().setHours(0, 0, 0, 0) >
              new Date(dueDate).setHours(0, 0, 0, 0)
            ) {
              acc.overdue.push(task);
            } else {
              acc.inProgress.push(task);
            }
            // console.log("acc", acc.inProgress);
            return acc;
          },
          { completed: [], inProgress: [], overdue: [] }
        );


        setData({
          completed: categorizedTasks.completed.length,
          inProgress: categorizedTasks.inProgress.length,
          overdue: categorizedTasks.overdue.length,
        });

        console.log("data",data)

        setTaskDetails(categorizedTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filteredTasks]);

  const categories = [];
  const colors = [];
  const labelColors = ["#FF6060", "#FBB214", "#1BCB80"];

  if (data.completed > 0) {
    categories.push({ name: "completed", value: data.completed });
    colors.push("#008000"); // Hex code for green
  }

  if (data.inProgress > 0) {
    categories.push({ name: "inProgress", value: data.inProgress });
    colors.push("#ffcf57"); // Hex code for yellow
  }

  if (data.overdue > 0) {
    categories.push({ name: "overDue", value: data.overdue });
    colors.push("#ff0000"); // Hex code for red
  }

  const completedCategories =
    categories.find((item) => item.name === "completed")?.value || 0;
  const totalCategories = categories.reduce((sum, item) => sum + item.value, 0);
  const averagePercentage =
    totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 0;
  const handleCategoryClick = (category) => {
    setPopupContent({
      title:'Completed Tasks - GST'|| category,
      tasks: taskDetails[category] || [],
    });
    setPopupVisible(true);
  };

  const handleTaskClick = (taskId, auto) => {
    if (auto) {
      navigate(`/tasks/auto`, { state: { taskId } });
    } else {
      navigate(`/tasks`, { state: { taskId } });
    }
    setPopupVisible(false);
  };

  // Export CSV
  // Export CSV
  // Export CSV

  // Export PDF

  console.log("meter graph inProgress length", data.inProgress);

  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          height: "auto", // Adjusted to auto to accommodate larger graphs
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "16px",
          position: "relative",
        }}
        // className="overflow-auto scrollable-element"
      >
        {loading ? (
          <div className="flex justify-center items-center m-2">
            <Loader />
          </div>
        ) : (
          <>
            <Header
              data={filteredTasks}
              columns={FourthGraphColumns}
              {...{ title: "Tasks Due Date" }}
            />
            {categories.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className=" m-2 flex justify-between items-center">
                {/* In Progress Gauge */}
                <div
                  style={{ width: "33%", height: "auto", textAlign: "center" }}
                >
                  <CustomGaugeChart
                    value={
                      data?.inProgress < 7
                        ? data.inProgress + 5
                        : data.inProgress
                    }
                    total={totalCategories}
                    label="Incompleted Tasks"
                    color="#FF6060"
                    onClick={() => handleCategoryClick("inProgress")}
                  />
                </div>

                {/* Overdue Gauge */}
                <div
                  style={{ width: "33%", height: "auto", textAlign: "center" }}
                >
                  <CustomGaugeChart
                    value={data.overdue}
                    total={totalCategories}
                    label="Overdue Tasks"
                    color="#FBB214"
                    onClick={() => handleCategoryClick("overdue")}
                  />
                </div>

                {/* Completed Gauge */}
                <div
                  style={{ width: "33%", height: "auto", textAlign: "center" }}
                >
                  <CustomGaugeChart
                    value={data.completed}
                    total={totalCategories}
                    label="Completed Tasks"
                    color="#1BCB80"
                    onClick={() => handleCategoryClick('completed')}
                  />
                </div>

                {/* Total Tasks */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "-5rem",
                    lineHeight: "2rem",
                    borderLeft: "3px solid #6b46c1",
                  }}
                >
                  <div
                    style={{
                      width: "10%",
                      height: "100%",

                      color: "#2B3674",
                      fontSize: "2rem", // Increased for better visibility, matching image
                      fontWeight: "bold",
                    }}
                  >
                    <span
                      style={{
                        marginLeft: ".5rem", // Added to match the vertical line in the image
                      }}
                    >
                      {totalCategories}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#A3AED0",
                      fontSize: "0.875rem",
                      marginLeft: ".5rem",
                    }}
                  >
                    Total Tasks
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* <div className="labels-overlay">
          {["inProgress", "overdue", "completed"].map((label, index) => {
            const count = [data.inProgress, data.overdue, data.completed][
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
                  <div
                    style={{
                      backgroundColor: backgroundColor,
                      width: "2.2rem",
                      height: ".8rem",
                      marginRight: "10px",
                    }}
                  />
                  <h6>
                    {label}: {count}
                  </h6>
                </div>
              </div>
            ) : null;
          })}
        </div> */}
      </div>

      <TaskDetailsPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupContent.title}
        tasks={popupContent.tasks}
        onTaskClick={handleTaskClick}
        companies={MeterGraphDetails}
      />
    </div>
  );
};

export default MeterGraph;
