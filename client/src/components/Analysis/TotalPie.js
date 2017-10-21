import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const TotalPie = ({totals, cardWidth}) => {
  const colors = [
    "#d2584c", // 使用中
    "#00bcd4"  // 空き
  ];

  const renderShape = (totals, pieWidth, pieHeight) => {
    const renderUsagePer = (totals) => {
      if (totals.length === 0) return "N/A";
      const total = totals.reduce( (a, b) => a.value + b.value );
      const usage = totals.filter( total => total.is_usage )[0].value;
      return Math.round(usage / total * 100);
    };

    const usage = renderUsagePer(totals);

    const x = pieWidth / 2;
    const y = pieHeight / 2;

    return (
      <g>
        <text x={x} y={y} textAnchor="middle"
              dominantBaseline="central" fill="#777" fontSize={30}>
          {renderUsagePer(totals)}%
        </text>
      </g>
    );
  };

  const renderCell = (color, idx) => (
    <Cell key={idx} fill={color} />
  );

  const pieWidth = cardWidth - 32;  // cardTextのpaddingが16なので
  const pieHeight = pieWidth * 0.65;

  return (
    <div>
      <PieChart width={pieWidth} height={pieHeight}>
        <Pie
          data={totals}
          innerRadius="80%"
          outerRadius="100%"
          paddingAngle={1}
          fill="#8884d8">

          {colors.map( (color, idx) => renderCell(color, idx))}

        </Pie>
        <Tooltip />
        {renderShape(totals, pieWidth, pieHeight)}
      </PieChart>
    </div>
  );
};

export default TotalPie;
