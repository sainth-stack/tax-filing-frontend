import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { base_url } from "../../const";

const PaymentGraph = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${base_url}/tasks/all`);
        console.log("API response:", response.data.data);

        const tasks = Array.isArray(response.data.data)
          ? response.data.data
          : []; // Ensure tasks is an array
        setLoading(false);

        if (tasks.length === 0) {
          console.warn("No tasks found or tasks is not an array");
          return;
        }

        // Group company counts by task type
        const companyCountsByTask = tasks.reduce((acc, task) => {
          const taskType = task?.taskType || "Unknown"; // Default to 'Unknown' if taskType is missing
          const companyName = task?.company || "Unknown"; // Default to 'Unknown' if company is missing

          if (!acc[taskType]) {
            acc[taskType] = {};
          }

          acc[taskType][companyName] = (acc[taskType][companyName] || 0) + 1;

          return acc;
        }, {});

        // Extract labels and data for the chart
        const labels = Object.keys(companyCountsByTask);
        const data = labels.map((taskType) =>
          Object.values(companyCountsByTask[taskType]).reduce(
            (sum, count) => sum + count,
            0
          )
        );

        // Use the predefined colors array to set unique colors for each bar
        const barColors = labels.map(
          (_, index) => colors[index % colors.length]
        );

        // Set the chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Companies",
              data: data,
              backgroundColor: barColors, // Set bar colors
              borderColor: "#1E88E5",
              borderWidth: 0.5,
              borderRadius: 5,
              fill: true,
              lineTension: 0.4,
              pointRadius: 0, // Set the point radius to 0 to hide the dot
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Task Types",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Companies",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default PaymentGraph;
