import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Charts from "../../components/charts/Charts";

const Dashboard = () => {
  return (
    <>
      <Layout>
        <div className="container">
          <div className="chart_container">
            <Charts />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
