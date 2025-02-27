import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Box, Typography } from "@mui/material";

const TaskProgressGaugePage = ({ categories = [], loading,setCategories }) => {
  // Default data structure if none provided
  const defaultCategories = [
    { label: "Incompleted Tasks", percentage: 20, color: "#FF5050" },
    { label: "Overdue Tasks", percentage: 30, color: "#FFA500" },
    { label: "Completed Tasks", percentage: 50, color: "#008000" },
  ];

  setCategories(defaultCategories)

  // Use provided categories or fallback to default
  const taskCategories = categories.length > 0 ? categories : defaultCategories;

  // Ensure percentages are between 0 and 100
  const normalizePercentage = (value) => Math.min(100, Math.max(0, value));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: 2,
          bgcolor: "#f5f5f5",
          borderRadius: 8,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: 2,
        bgcolor: "#f5f5f5",
        borderRadius: 8,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {taskCategories.map((category, index) => (
        <Box
          key={index}
          sx={{
            textAlign: "center",
            width: "30%", // Adjust width for responsiveness
            minWidth: "200px", // Minimum width to ensure readability
            margin: 1,
          }}
        >
          <CircularProgressbar
            value={normalizePercentage(category.percentage)}
            text={`${normalizePercentage(category.percentage)}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: category.color,
              textColor: "#333",
              trailColor: "#e0e0e0",
              strokeLinecap: "round",
              pathTransitionDuration: 0.5,
            })}
          />
          <Typography
            variant="subtitle1"
            sx={{ mt: 1, fontWeight: 500, wordBreak: "break-word" }}
          >
            {category.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TaskProgressGaugePage;