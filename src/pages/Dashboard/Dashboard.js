import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Charts from "../../components/charts/Charts";

const Dashboard = () => {
  return (
    <>
      <Layout>
        <div className="container" style={{width:'100%',maxWidth:'100%'}}>
          <div className="chart_container">
            <Charts />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
