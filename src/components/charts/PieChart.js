import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router-dom";
import Loader from "../helpers/loader";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { CloseOutlined, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Header from "../../pages/Dashboard/card-container";
import NoDataFound from "./NoDataFound";
import { FirstGraphColumns } from "../Export/data";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ companyDetails, loading }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  });

  const [clickedCompany, setClickedCompany] = useState([]);
  const [clickedLabel, setClickedLabel] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleCompanyClick = (companyName) => {
    navigate("/company", { state: { companyName } });
  };

  useEffect(() => {
    const combinationCounts = companyDetails.reduce((acc, company) => {
      const { constitution, subConstitution } = company;


      let key = "";
      if (constitution === "Partnership") {
        key =
          subConstitution === "registered"
            ? "Partnership Registered"
            : subConstitution === "llp"
              ? "Limited Liability Partnership (LLP)"
              : "Partnership Unregistered";
      } else if (constitution === "Proprietorship") {
        key = "Proprietorship";
      } else if (constitution === "PrivateLimited") {
        key = "PrivateLimited";
      } else if (constitution === "LLP") {
        key = "LLP";
      }



      if (key) {
        acc[key] = (acc[key] || 0) + 1;
      }

      return acc;
    }, {});

    const labels = Object.keys(combinationCounts);
    const data = Object.values(combinationCounts);
    const backgroundColor = labels.map((label, index) => {
            const colors = ["#4318FF","#A6AEB8","#C27CFF","#6AD2FF","#FB4E22",];


      return colors[index % colors.length];
    });

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: "#fff",
          borderWidth: 0,
        },
      ],
    });
  }, [companyDetails]);

  const onChartClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const clickedLabel = chartData.labels[clickedElementIndex];

      const clickedCompanies = companyDetails.filter((company) => {
        const { constitution, subConstitution } = company;
        let key = "";
        if (constitution === "Partnership") {
          key =
            subConstitution === "registered"
              ? "Partnership Registered"
              : subConstitution === "llp"
                ? "Limited Liability Partnership (LLP)"
                : "Partnership Unregistered";
        } else if (constitution === "Proprietorship") {
          key = "Proprietorship";
        } else if (constitution === "PrivateLimited") {
          key = "PrivateLimited";
        }
        else if (constitution === "LLP") {
          key = "LLP";
        }
        return key === clickedLabel;
      });

      setClickedCompany(clickedCompanies);
      setClickedLabel(clickedLabel);

      // Set popup position
      setPopupPosition({ x: event.native.clientX, y: event.native.clientY });
      setPopupVisible(true);
    }
  };

 const options = {
  cutout:'55%',
   plugins: {
     legend: {
       display: false, // Enable the legend
       position: "top", // Position the legend at the top
       labels: {
         boxWidth: 35, // Slightly larger legend boxes
         padding: 10, // More spacing between legend items
         font: {
           size: 14, // Slightly larger font for readability
           weight: "bold", // Bold legend text
         },
         color: "#333", // Darker color for better contrast
         // Optional: usePointStyle can make the legend markers circular
         // usePointStyle: true,  // Uncomment this to use circular points instead of squares
       },
       // Layout configuration for horizontal legend
       layout: {
         padding: 10, // Optional: Adds space between the items
         align: "center", // Center align the legend horizontally
         horizontalAlign: "center", // Ensures the items are displayed in a row
       },
     },

     tooltip: {
       enabled: true, // Enable tooltips
       callbacks: {
         label: (tooltipItem) => {
           const value = tooltipItem.raw || 0;
           const total = tooltipItem.chart.data.datasets[0].data.reduce(
             (acc, val) => acc + val,
             0
           );
           const percentage = ((value / total) * 100).toFixed(2);
           return `${percentage}%`; // Only show the percentage
         },
       },
     },
     datalabels: {
       display: true, // Display data labels
       color: "#fff", // Set text color of the data labels
       font: {
         weight: "bold", // Bold font for the data labels
         size: 16, // Set the font size of the data labels
       },
       formatter: (value, context) => {
         return `${value}`; // Display the value in the label
       },
     },
   },
   elements: {
     arc: {
       borderWidth: 0, // Border width for each arc (segment of the chart)
       borderColor: "#fff", // Border color for each segment
       borderRadius: 0, // Set rounded corners for the arcs
     },
   },
   onClick: onChartClick, // Event handler for chart clicks
 };

  // Create a custom plugin to draw text in the center of the Doughnut chart
  ChartJS.register({
    id: 'centerText', // unique identifier for the plugin
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const fontSize = 24; // Set font size for the text
      const fontStyle = 'bold';
      const fontFamily = 'Arial'; // Font family can be adjusted

      // Calculate the total value of the data
      // const total = chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);

      // Set up the text styles
      ctx.save();
      ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = '#000'; // Set text color
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Display the total value in the center
      // ctx.fillText(`${total||100}`, width / 2, height / 1.8);

      ctx.restore();
    },
  });


  /* columns */
  
  

  
 

  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          height: "400px", // Match pie chart height
          // border: "1px solid #e0e0e0", // Light gray border for a card-like appearance
          borderRadius: "8px", // Rounded corners for a smoother look
          backgroundColor: "#fff", // Card-like white background
          padding: "8px",
          // Add padding for a card-like layout
        }}
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
              data={companyDetails}
              columns={FirstGraphColumns}
              title={"Company Status by Constitution and Subconstitution"}
              />
              
            <div className="flex justify-center  items-start ">
              {/* Graph Section */}

              <div className="w-full">
                <div style={{ width: "auto", height: "300px" }}>
                  {chartData.labels.length === 0 ? (
                    <>
                      <Grid
                        container
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <NoDataFound />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        {/* Legend Section (Labels at the top) */}
                        {/* <div className="w-full ">
                          <ul className="flex justify-center ">
                            {chartData.labels.length !== 0 &&
                              chartData.labels.map((label, index) => (
                                <li key={index} className="flex items-center">
                                  <span
                                    className="h-4 inline-block mr-1"
                                    style={{
                                      minWidth: "17px",
                                      backgroundColor:
                                        chartData.datasets[0].backgroundColor[
                                          index
                                        ],
                                    }}
                                  ></span>
                                  <span
                                    className="mx-2"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {label}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div> */}

                        {/* Doughnut Chart (Below the Labels) */}
                        <div style={{ width: "auto", height: "330px" }}>
                          <Doughnut data={chartData} options={options} />
                        </div>
                      </Grid>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Custom Legends Section */}
            </div>
          </>
        )}
      </div>

      {popupVisible && (
        <div
          style={{
            position: "absolute",
            top: popupPosition.y,
            left: popupPosition.x,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            padding: "16px",
            zIndex: 1000,
            width: "250px",
            maxHeight: "300px", // Fixed maximum height
            overflowY: "auto", // Enable vertical scrolling if content overflows
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
              whiteSpace: "nowrap", // Prevent text wrapping for the header
              overflow: "hidden", // Hide any overflowing text
              textOverflow: "ellipsis", // Show ellipsis if text overflows
            }}
          >
            {clickedLabel}
          </div>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {clickedCompany.map((company, index) => (
              <li
                key={index}
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    index !== clickedCompany.length - 1
                      ? "1px solid #eee"
                      : "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  overflow: "hidden", // Prevent overflow in list items
                  textOverflow: "ellipsis", // Show ellipsis if text overflows
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
                className="hover:bg-gray-100"
                onClick={() => handleCompanyClick(company?._id)}
              >
                {/* <strong style={{ color: "#555" }}>Company:</strong> */}
                <span style={{ color: "#007BFF" }}>{company?.companyName}</span>
              </li>
            ))}
          </ul>
          <IconButton
            onClick={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "50%",
              padding: "6px",
            }}
          >
            <CloseOutlined />
          </IconButton>
        </div>
      )}
    </div>
  );

};

export default PieChart;
