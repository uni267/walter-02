import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const TotalPie = ({totals, cardWidth}) => {
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

    const usage = renderUsagePer(totals);

    const fontSize = 30;
    const maxDigit = 4; // 100%なので4桁
    const digit = usage.toString().length + 1; // %がつくので+1
    const margin = (maxDigit - digit) * (fontSize * 0.35);
    const xpos = 115; // pieのinnerRadiusに文字がかかる基準値
    const y = xpos;
    const x = xpos + margin;

    return (
      <g>
        <text x={x} y={y} textAnchor="start" fill="#777" fontSize={fontSize}>
          {renderUsagePer(totals)}%
        </text>
      </g>
    );
  };

  const renderCell = (color, idx) => (
    <Cell key={idx} fill={color} />
  );

  const pieWidth = cardWidth - 32;  // cardTextのpaddingが16なので
  const outerRadius = pieWidth * 0.3;
  const innerRadius = outerRadius * 0.8;

  return (
    <div>
      <PieChart width={pieWidth} height={200}>
        <Pie
          data={totals}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
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
