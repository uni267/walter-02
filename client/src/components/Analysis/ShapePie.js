import React from "react";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const ShapePie = ({data, cardWidth, pieColor}) => {
  const renderShape = (data) => {
    if (data.length === 0) return "N/A";

    const fontSize = 20;
    const maxDigit = 10; // 10桁までならinnnerRadiusに重ならない
    const digit = data[0].value.toString().length;
    const margin = (maxDigit - digit) * (fontSize / 2.8);
    const xpos = 90; // pieのinnerRadiusに文字がかかる基準値
    const x = xpos + margin;

    return (
      <g>
        <text x={x} y={110} textANchor="middle" fill="#777" fontSize={fontSize}>
          {data[0].value}
        </text>
      </g>
    );
  };

  const pieWidth = cardWidth - 32;
  const outerRadius = pieWidth * 0.3;
  const innerRadius = outerRadius * 0.8;

  return (
    <div>
      <PieChart width={pieWidth} height={200}>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill={pieColor} />
        {renderShape(data)}
      </PieChart>
    </div>
  );
};

export default ShapePie;
