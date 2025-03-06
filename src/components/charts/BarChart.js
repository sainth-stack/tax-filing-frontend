import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import Loader from "../helpers/loader";
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import "jspdf-autotable";
import Header from "../../pages/Dashboard/card-container";
import NoDataFound from "./NoDataFound";
import { SecondGraphColumns } from "../Export/data";
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChart = ({ chartHeight, barDetails, loading }) => {
  // console.log("second graph bar details",barDetails)
  const colors = [
    "#6AD2FF",
    "#333333",
    "#FFBD3A",
    "#FB4E22",
    "#C27CFF",
    "#A6AEB8",
    "#4318FF",
    "#EC407A",
    "#AB47BC",
    "#FFCA28",
  ];

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Companies By Task Type",
        data: [],
        borderColor: "#29CC3F",
        borderWidth: 4,
        fill: true,
        lineTension: 0.5,
        pointRadius: 0,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(2, 5, 0, 200);
          gradient.addColorStop(0, "#29CC3F");
          gradient.addColorStop(0.8, "rgba(41, 204, 63, 0.2)");
          return gradient;
        },
      },
    ],
  });
  const [popupVisible, setPopupVisible] = useState(false);

  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [clickedCompanies, setClickedCompanies] = useState([]);
  const [clickedLabel, setClickedLabel] = useState("");
  const [companyGroupsByTask, setCompanyGroupByTask] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Remove tasks API call and work only with barDetails

        // Filter companies with active statuses in different categories (e.g., gst, incomeTax)
        const filteredCompanies = barDetails.filter((company) => {
          return (
            company.gst?.status === "active" ||
            company.incomeTax?.status === "active" ||
            company.esi?.status === "active" ||
            company.providentFund?.status === "active" ||
            company.professionalTax?.status === "active" ||
            company.tds?.status === "active" ||
            company.shopCommercialEstablishment?.status === "active" ||
            company.msme?.status === "active" ||
            company.fssai?.status === "active" ||
            company.factoryLicense?.status === "active" ||
            company.importExport?.status === "active" ||
            company.partnershipFirmFormC?.status === "active" ||
            company.shramSuvidhaPortal?.status === "active" ||
            company.mca?.status === "active"
          );
        });

        // Group companies by active task type
        const activeCompanyGroups = filteredCompanies.reduce((acc, company) => {
          const taskTypes = [
            "gst",
            "incomeTax",
            "esi",
            "providentFund",
            "professionalTax",
            "tds",
            "shopCommercialEstablishment",
            "msme",
            "fssai",
            "factoryLicense",
            "importExport",
            "partnershipFirmFormC",
            "shramSuvidhaPortal",
            "mca",
          ];

          taskTypes.forEach((taskType) => {
            if (company[taskType]?.status === "active") {
              if (!acc[taskType]) {
                acc[taskType] = {
                  ids: [],
                  names: [],
                  idsWithNames: [],
                };
              }

              const companyId = company._id;
              const companyName = company.companyName;

              acc[taskType].ids.push(companyId);
              acc[taskType].names.push(companyName);
              acc[taskType].idsWithNames.push([companyId, companyName]);
            }
          });

          return acc;
        }, {});

        // Set the grouped active company data
        setCompanyGroupByTask(activeCompanyGroups);

        // Prepare chart data
        const labels = Object.keys(activeCompanyGroups);
        const data = labels?.map((taskType) => activeCompanyGroups[taskType].ids.length);

        // setFinalData(
        //   labels?.map((taskType) => activeCompanyGroups[taskType].ids.length)
        // );

        const barColors = labels.map(
          (_, index) => colors[index % colors.length]
        );

        setChartData({
          labels: labels.map((label) => label),
          datasets: [
            {
              label: "Number of Active Companies",
              data: data,

              backgroundColor: barColors,
              borderColor: "#1E88E5",
              borderWidth: 0,
              borderRadius: 0,
              fill: true,
              lineTension: 0.4,
              pointRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };

    fetchData();
  }, [barDetails]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      const companies = companyGroupsByTask[label]?.idsWithNames || [];

      const chartContainer = event.chart.canvas.parentNode;
      const chartRect = chartContainer.getBoundingClientRect();

      const popupX = event.clientX - chartRect.left + window.scrollX;
      const popupY = event.clientY - chartRect.top + window.scrollY;

      setClickedLabel(label);
      setClickedCompanies(companies);
      setPopupPosition({ x: popupX, y: popupY });
      setPopupVisible(true);
    }
  };

 const options = {
  cutout:'55%',
   onClick: handleClick,
   plugins: {
     legend: {
       display: false,
       position: "top",
       labels: {
         boxWidth: 35, // Slightly larger legend boxes
         padding: 10, // More spacing between legend items
         font: {
           size: 14, // Slightly larger font for readability
           weight: "bold", // Bold legend text
         },
         color: "#333", // Darker color for better contrast
        //  usePointStyle: true, // Circular points instead of squares
       },
     },
     tooltip: {
       enabled: true,
       backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker, semi-transparent background
       titleFont: {
         size: 16,
         weight: "bold",
       },
       bodyFont: {
         size: 14,
       },
       padding: 10, // More padding for a cleaner look
       borderColor: "#ccc", // Subtle border
       borderWidth: 1,

       callbacks: {
         // Modify the label to show percentage
         label: (tooltipItem) => {
           const value = tooltipItem.raw;
           const total = tooltipItem.chart.data.datasets[0].data.reduce((a, b) => a + b, 0); // Total value of the doughnut chart
           const percentage = ((value / total) * 100).toFixed(2); // Calculate the percentage

           return `${tooltipItem.label}: ${percentage}%`; // Display the label with percentage
          },
       },
     },
     datalabels: {
       display: true,
       color: "white",
       formatter: (value) => value,
       font: {
         size: 16, // Slightly larger for emphasis
         weight: "bold",
         family: "Arial", // Consistent, clean font
       },
       textShadowBlur: 10, // Subtle shadow for better contrast (optional)
       textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color (optional)
     },
   },
   responsive: true,
   maintainAspectRatio: false,
   cutout: "50%", // Slightly larger center hole for a modern look
   animation: {
     animateScale: true, // Scales segments on load
     animateRotate: true, // Rotates chart on load
     duration: 500, // Smooth 1-second animation
     easing: "easeOutQuart", // Smooth easing effect
   },
   hover: {
     mode: "nearest", // Highlights the nearest segment on hover
     intersect: true,
     animationDuration: 400, // Smooth hover animation
   },
 };

  const handleCompanyClick = (taskId) => {
    navigate("/company", { state: { companyName: taskId } });
  };

  function formatString(str) {
    return str
      .replace(/([A-Z])/g, " $1") // Add space before each uppercase letter
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Remove any leading/trailing whitespace
  }

  return (
    <div className="container">
      <div
        className="bar_chart p-2"
        style={{
          width: "100%",
          position: "relative",
          height: chartHeight || "400px",
          // border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "8px",
        }}
      >
        {loading ? (
          <>
            <div className="flex justify-center items-center p-4">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <Header
              data={barDetails}
              columns={SecondGraphColumns}
              {...{
                title: "Active Services by company",
              }}
            />
            {chartData.labels.length === 0 ? (
              <NoDataFound />
            ) : (
              <>
                <div className="">
                  {/* <ul className="flex flex-wrap w-full capitalize">
                    {chartData.labels.length !== 0 &&
                      chartData.labels.map((label, index) => (
                        <li
                          key={index}
                          className="flex items-center mb-2 mr-4 capitalize"
                        >
                          <span
                            className="w-4 h-4 inline-block mr-2 capitalize"
                            style={{
                              backgroundColor:
                                chartData.datasets[0].backgroundColor[index],
                            }}
                          ></span>
                          <span
                            style={{ fontSize: "12px", fontWeight: 600 }}
                            className="capitalize"
                          >
                            {label}
                          </span>
                        </li>
                      ))}
                  </ul> */}

                  <div className="w-full">
                    <div style={{ width: "auto", height: "300px" }}>
                      <Doughnut
                        data={{
                          ...chartData,
                          labels: chartData.labels.map((item) =>
                            formatString(item)
                          ),
                        }}
                        options={options}
                        style={{ width: "250px", height: "250px" }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {popupVisible && (
        <div
          style={{
            position: "absolute",
            marginTop: "-400px",
            marginLeft: "300px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            padding: "12px",
            zIndex: 1000,
            width: "250px",
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {clickedLabel}
          </div>

          {loading ? (
            <>
              <div className="flex justify-center items-center p-4">
                <Loader size={30} />
              </div>
            </>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {clickedCompanies.map(([companyId, companyName], index) => (
                <li
                  key={companyId}
                  style={{
                    padding: "10px 12px",
                    borderBottom:
                      index !== clickedCompanies.length - 1
                        ? "1px solid #eee"
                        : "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  className="hover:bg-gray-100"
                  onClick={() => handleCompanyClick(companyId)} // Pass companyId on click
                >
                  {/* <strong style={{ color: "#555" }}>Company:</strong>{" "} */}
                  <span style={{ color: "#007BFF" }}>{companyName}</span>
                </li>
              ))}
            </ul>
          )}

          <IconButton
            onClick={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#f5f5f5",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CloseOutlined />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default BarChart;
