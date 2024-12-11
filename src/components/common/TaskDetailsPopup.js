import React from "react";
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import NoDataFound from "../charts/NoDataFound";
import { isTaskCompleted } from "../../utils/const";

const TaskDetailsPopup = ({ 
  visible, 
  onClose, 
  title, 
  tasks, 
  onTaskClick 
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        padding: "24px",
        zIndex: 1000,
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <IconButton
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CloseOutlined />
      </IconButton>

      <div>
        <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>
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
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
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
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                alignItems: 'center'
              }}>
                {/* Left column */}
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ 
                      fontSize: "12px", 
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Company</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2c3e50"
                    }}>
                      {task.company || "No Company Name"}
                    </h4>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      fontSize: '13px'
                    }}>
                      <strong>PAN:</strong> {task.pan || "N/A"}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      fontSize: '13px'
                    }}>
                      <strong>Type:</strong> {task.taskType || "Unknown"}
                    </span>
                  </div>
                </div>
                {/* Right column */}
                <div>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: isTaskCompleted(task) ? '#e8f5e9' : '#ffebee',
                      color: isTaskCompleted(task) ? '#2e7d32' : '#c62828',
                      fontSize: '13px',
                      fontWeight: '500',
                      alignSelf: 'flex-start'
                    }}>
                      {isTaskCompleted(task) ? "Completed" : "Not Completed"}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      fontSize: '13px'
                    }}>
                      <strong>Month:</strong> {
                        task.startDate 
                          ? new Date(task.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })
                          : task.month || task.taskMonth || "N/A"
                      }
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#e9ecef',
                      fontSize: '13px'
                    }}>
                      <strong>Task:</strong> {task.taskName || "N/A"}
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