import React from "react";
import { Box, IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import NoDataFound from "../charts/NoDataFound";
import { isTaskCompleted } from "../../utils/const";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import { getTaskDetails, getTaskDisplayName, GetTaskLabel, getTaskNumber } from "../../utils/TaskTypeMap";
   import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
                            import CancelIcon from "@mui/icons-material/Cancel";

const TaskDetailsPopup = ({
  visible,
  onClose,
  title,
  tasks,
  companies,
  onTaskClick
}) => {
  if (!visible) return null;
console.log(tasks)
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "80%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#F4F7FE",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        padding: "24px",
        zIndex: 1000,
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="flex items-end justify-end sticky top-0 z-50  -left-4">
        <IconButton
          onClick={onClose}
          className="-left-4"
          style={{
            position: "sticky",

            top: "12px",
            left: "0",
            backgroundColor: "#fff",
            boxShadow: "10px 4px 24px rgba(0, 0, 0, 0.15)",
          }}
        >
          <HighlightOffSharpIcon />
        </IconButton>
      </div>
      <div>
        <h3
          style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}
        >
          {title}
        </h3>
        {tasks?.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              onClick={() => onTaskClick(task._id, task?.auto)}
              style={{
                marginBottom: "12px",
                padding: "16px",
                cursor: "pointer",
                borderRadius: "1rem",
                backgroundColor: "#fff",
                transition: "all 0.2s ease",
                border: "1px solid #eee",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Task content grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                {/* Left column */}
                <div>
                  <div style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Company
                    </span>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#2c3e50",
                      }}
                    >
                      {task.company || "No Company Name"}
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      <strong>
                        {getTaskNumber(task.taskType, task.company, companies)}
                      </strong>{" "}
                    </span>
                  </div>
                </div>
                {/* Right column */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor: isTaskCompleted(task)
                          ? "#C1FFE5"
                          : "#FFC1C2",
                        color: isTaskCompleted(task) ? "#2e7d32" : "#c62828",
                        fontSize: "13px",
                        fontWeight: "500",
                        alignSelf: "flex-start",
                      }}
                    >
                      {isTaskCompleted(task) ? (
                        <>
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            width="100%"
                          >
                            <span>Completed</span>

                            <CheckCircleIcon sx={{ fontSize: 16, ml: 1 }} />
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <span>Not Completed</span>
                            <CancelIcon fontSize="small" sx={{ ml: 1 }} />
                          </Box>
                        </>
                      )}
                    </span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#D9D9D9",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Month:</strong>{" "}
                      {task.startDate
                        ? new Date(
                            new Date(task.startDate).setMonth(
                              new Date(task.startDate).getMonth() - 1
                            )
                          ).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })
                        : task.month || task.taskMonth || "N/A"}
                    </span>
                    <span
                      style={{
                        padding: "5px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#D9D9D9",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Task:</strong>{" "}
                      {getTaskDisplayName(
                        task.taskName,
                        task.taskType,
                        task.gstMonthly_gstType
                      ) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <NoDataFound />
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPopup; 