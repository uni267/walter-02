import React from "react";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const FileCountPie = ({fileCount}) => {
  const renderShape = (fileCount) => {
    if (fileCount.length === 0) return "N/A";

    const fontSize = 20;
    const maxDigit = 10; // 10桁までならinnnerRadiusに重ならない
    const digit = fileCount[0].value.toString().length;
    const margin = (maxDigit - digit) * (fontSize / 2.8);
    const xpos = 90; // pieのinnerRadiusに文字がかかる基準値
    const x = xpos + margin;

    return (
      <g>
        <text x={x} y={110} textANchor="middle" fill="#777" fontSize={fontSize}>
          {fileCount[0].value}
        </text>
      </g>
    );
  };

  return (
    <div>
      <PieChart width={320} height={200}>
        <Pie
          data={fileCount}
          innerRadius={80}
          outerRadius={100}
          fill="#FFBB28"/>
        {renderShape(fileCount)}
      </PieChart>
    </div>
  );
};

export default FileCountPie;
// ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
