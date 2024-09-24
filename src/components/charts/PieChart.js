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
      }

      if (key) {
        acc[key] = (acc[key] || 0) + 1;
      }

      return acc;
    }, {});

    const labels = Object.keys(combinationCounts);
    const data = Object.values(combinationCounts);
    const backgroundColor = labels.map((label, index) => {
      const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

      return colors[index % colors.length];
    });

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: "#fff",
          borderWidth: 1,
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
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} Companies`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "bold",
          size: 30,
        },
        formatter: (value, context) => {
          return `${value}`;
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 10,
      },
    },
    onClick: onChartClick,
  };

  const handleExportAsCSV = () => {
    const csvContent = companyDetails
      .map((company) => {
        return `${company.companyName || "--"},${company.constitution || "--"
          },${company.subConstitution || "--"},${company.clientStatus || "--"},${company.authorisedPerson || "--"
          },${company.phone || "--"},${company.mailId || "--"},${company.pan || "--"
          },${company.companyAddress || "--"}`;
      })
      .join("\n");

    const blob = new Blob(
      [
        `Company Name,Constitution,Sub Constitution,Client Status,Authorised Person,Phone,Mail ID,PAN,Company Address\n${csvContent}`,
      ],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(blob, "company_details.csv");
  };

  //export as pdf vishnu
  const handleExportAsPDF = () => {
    const doc = new jsPDF();

    console.log("Generating PDF...");

    if (companyDetails.length === 0) {
      console.error("No data to export.");
      return;
    }

    doc.text("Company Details", 14, 16);

    const tableData = companyDetails.map((company) => ({
      CompanyName: company.companyName || " --",
      Constitution: company.constitution || " --",
      SubConstitution: company.subConstitution || " --",
      clientStatus: company.clientStatus || " --",
      authorisedPerson: company.authorisedPerson || " --",
      phone: company.phone || " --",
      mailId: company.mailId || " --",
      pan: company.pan || " --",
      companyAddress: company.companyAddress || " --",
    }));

    doc.autoTable({
      head: [
        [
          "Company Name",
          "Constitution",
          "Sub Constitution",
          "Client Status",
          "Authorized Person",
          "Phone",
          "MailId",
          "PAN",
          "Company Address",
        ],
      ],
      body: tableData.map((item) => [
        item.CompanyName,
        item.Constitution,
        item.SubConstitution,
        item.clientStatus,
        item.authorisedPerson,
        item.phone,
        item.mailId,
        item.pan,
        item.companyAddress,
      ]),
      startY: 30,
    });

    doc.save("company_details.pdf");
    console.log("PDF generated and downloaded.");
  };

  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          height: "380px", // Match pie chart height
          border: "1px solid #e0e0e0", // Light gray border for a card-like appearance
          borderRadius: "8px", // Rounded corners for a smoother look
          backgroundColor: "#fff", // Card-like white background
          padding: "8px",
          // Add padding for a card-like layout
        }}
      >
        {/* //Header part */}

        {/* 3-dot Icon */}

        {loading ? (
          <>
            <div className="flex justify-center   items-center m-2">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <Header
              title={"Company Status by Constitution and Subconstitution"}
              {...{ handleExportAsCSV, handleExportAsPDF }}
            />
            <div className="flex justify-center  items-start p-4">
              {/* Graph Section */}

              <div className="w-full">
                <div style={{ width: "auto", height: "300px" }}>
                  {chartData.labels.length === 0 ? (
                    <>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        style={{ width: "700px", height: "300px" }}
                      >
                        <NoDataFound />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Doughnut data={chartData} options={options} />
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Custom Legends Section */}

              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <ul className="space-y-2 ">
                  <h2 className="text-lg font-bold mb-4"></h2>
                  {chartData.labels.length !== 0 &&
                    chartData.labels.map((label, index) => (
                      <>
                        <li key={index} className="flex items-center">
                          <span
                            className=" h-4 inline-block mr-1"
                            style={{
                              minWidth: "17px",
                              backgroundColor:
                                chartData.datasets[0].backgroundColor[index],
                            }}
                          ></span>
                          <span className="mx-2">{label}</span>
                        </li>
                      </>
                    ))}
                </ul>
              </div>
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
                <strong style={{ color: "#555" }}>Company:</strong>
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
