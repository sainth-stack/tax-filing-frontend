import React from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

const Charts = () => {
  return (
    <div className="p-4 flex justify-center">
      <PieChart />
      <BarChart />
    </div>
  );
};

export default Charts;
