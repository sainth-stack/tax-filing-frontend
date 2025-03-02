import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const SemiCircleChart = ({ data, colors, width = 300, height = 150 }) => {
  const RADIAN = Math.PI / 180;

  // Custom label for better visibility
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx="50%"
        cy="100%"
        startAngle={180}
        endAngle={0}
        innerRadius={50}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default SemiCircleChart;
