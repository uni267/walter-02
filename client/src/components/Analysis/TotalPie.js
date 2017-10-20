import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const TotalPie = ({totals}) => {
  const colors = [
    "#d2584c", // 使用中
    "#00bcd4"  // 空き
  ];

  const renderShape = (totals) => {
    const renderUsagePer = (totals) => {
      if (totals.length === 0) return "N/A";
      const total = totals.reduce( (a, b) => a.value + b.value );
      const usage = totals.filter( total => total.name === "used" )[0].value;
      return Math.round(usage / total * 100);
    };

    return (
      <g>
        <text x={160} y={115} textAnchor="middle" fill="#777" fontSize="30">
          {renderUsagePer(totals)}%
        </text>
      </g>
    );
  };

  const renderCell = (color, idx) => (
    <Cell key={idx} fill={color} />
  );

  return (
    <div>
      <PieChart width={320} height={200}>
        <Pie
          data={totals}
          innerRadius={80}
          outerRadius={100}
          paddingAngle={1}
          fill="#8884d8">

          {colors.map( (color, idx) => renderCell(color, idx))}

        </Pie>
        {renderShape(totals)}
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default TotalPie;
