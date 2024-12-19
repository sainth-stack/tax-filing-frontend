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
import TaskDetailsPopup from "../common/TaskDetailsPopup";
import { columns, FourthGraphColumns, ThirdGraphColumns } from "../Export/data";

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
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', tasks: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorizedTasks = filteredTasks.reduce(
          (acc, task) => {
            const dueDate = new Date(task.dueDate);
            const actualCompletionDate = (task?.actualCompletionDate || task?.pfMonthly_filedate || task?.esi_fileDate || task?.pft_fileDate || task?.gstMonthly_filedate)
              ? new Date((task?.actualCompletionDate || task?.pfMonthly_filedate || task?.esi_fileDate || task?.pft_fileDate || task?.gstMonthly_filedate))
              : null;

            if (actualCompletionDate) {
              acc.completed.push(task);
            } else if (new Date() > dueDate) {
              acc.overdue.push(task);
            } else {
              acc.inProgress.push(task);
            }
            return acc;
          },
          { completed: [], inProgress: [], overdue: [] }
        );

        setData({
          completed: categorizedTasks.completed.length,
          inProgress: categorizedTasks.inProgress.length,
          overdue: categorizedTasks.overdue.length,
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
  const labelColors = ["#008000", "#ffcf57", "#ff0000"];

  if (data.completed > 0) {
    categories.push({ name: 'completed', value: data.completed });
    colors.push("#008000"); // Hex code for green
  }

  if (data.inProgress > 0) {
    categories.push({ name: 'inProgress', value: data.inProgress });
    colors.push("#ffcf57"); // Hex code for yellow
  }

  if (data.overdue > 0) {
    categories.push({ name: 'overDue', value: data.overdue });
    colors.push("#ff0000"); // Hex code for red
  }



  const completedCategories = categories.find(item => item.name === "completed")?.value || 0;
  const totalCategories = categories.reduce((sum, item) => sum + item.value, 0);
  const averagePercentage =
    totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 0;
  const handleCategoryClick = (category) => {
    setPopupContent({
      title: category,
      tasks: taskDetails[category] || []
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
 

  console.log("meter graph data", filteredTasks);/*  */
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
                data={filteredTasks}
                 columns={FourthGraphColumns}

                {...{ title: "Tasks Due Date" }}
              />
              {categories.length === 0 ? (
                <NoDataFound />
              ) : (
                <>
                  <div className="mt-10 m-2" style={{ position: "relative" }}>
                    <GaugeChart
                      id="gauge-chart"
                      nrOfLevels={(categories && categories.length) || 1}
                      percent={(averagePercentage / 100).toFixed(3)}
                      textColor="#000"
                      fontSize="20px"
                      colors={colors}
                      arcWidth={0.3}
                      needleColor="#000000"
                      arcPadding={0.01}
                      needleBaseColor="#000000"
                      needleShadowColor="#000000"
                      formatTextValue={(averagePercentage) =>
                        `${averagePercentage}%`
                      }
                    />
                    {data?.overdue > 0 && (
                      <div
                        style={{
                          position: "absolute",

                          top: "45%",
                          right: "23%",
                          color: "#FFF",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {data?.overdue}
                      </div>
                    )}
                    {data?.inProgress > 0 && (
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
                    {data?.completed > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "45%",
                          left: "23%",
                          color: "#FFF",
                          fontSize: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {parseInt(data?.completed) > 0 && data?.completed}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "10%",
                        left: "-40px",
                      }}
                    ></div>
                  </div>
                </>
              )}
            </>
          )}

          <div className="labels-overlay">
            {["completed", "inProgress", "overdue"].map((label, index) => {
              const count = [data.completed, data.inProgress, data.overdue][
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
                        marginRight: "10px",
                      }}
                    />
                    <h6>
                      {" "}
                      {label}: {count}
                    </h6>
                  </div>
                </div>
              ) : null;
            })}
          </div>
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
    </>
  );
};

export default MeterGraph;
