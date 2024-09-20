import React from "react";

const ChartsHeader = ({ title }) => {
  return (
    <>
      <h2
        style={{
          textAlign: "start",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          // marginBottom: "16px"
        }}
      >
        {title}
      </h2>
    </>
  );
};

export default ChartsHeader;
