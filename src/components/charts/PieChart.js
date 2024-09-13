import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router-dom";
import Loader from "../helpers/loader";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import DasahboardCompanyAccordian from "../../pages/company/DasahboardCompanyAccordian";
import { CloseOutlined } from "@mui/icons-material";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [clickedCompany, setClickedCompany] = useState([]);
  const [clickedLabel, setClickedLabel] = useState("");
  const [clickedCompanyName, setClickedCompanyName] = useState();
  const navigate = useNavigate();

  const handleCompanyClick = (companyName) => {
    setClickedCompanyName(companyName);

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
      const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
      return colors[index % colors.length]; // Cycle through colors
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
      setModalOpen(true);
    }
  };

  const options = {
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false,
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

  return (
    <div className="container">
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          height: "40vh",
        }}
      >
        {loading ? (
          <>
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              {loading ? "Loading..." : "Tax Filing"}
            </h1>
            <div className="flex justify-center items-center m-2">
              <Loader size={30} />
            </div>
          </>
        ) : (
          <div className="flex justify-center h-[40vh] p-2">
            <Doughnut data={chartData} options={options} />
          </div>
        )}
      </div>

      {clickedCompanyName && (
        <DasahboardCompanyAccordian companyName={clickedCompanyName} />
      )}
      <div className="">
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fullWidth
          sx={{ position: "absolute" }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            Selected {clickedLabel} Companies
          </DialogTitle>
          <DialogContent>
            <ul className=" ">
              {clickedCompany.map((company, index) => (
                <li
                  key={index}
                  className="shadow-sm border-2 m-2 p-1 hover:shadow-md"
                  onClick={() => handleCompanyClick(company?.companyName)}
                >
                  <b>{"Company Name :"}</b>
                  <span className="mx-4 capitalize">
                    {company?.companyName}
                  </span>
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "8px",
            }}
          >
            <IconButton onClick={() => setModalOpen(false)} color="primary">
              <CloseOutlined />
            </IconButton>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PieChart;
