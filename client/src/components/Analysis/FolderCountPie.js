import React from "react";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const FolderCountPie = ({folderCount}) => {
  const renderShape = (folderCount) => {
    if (folderCount.length === 0) return "N/A";

    const fontSize = 20;
    const maxDigit = 10; // 10桁までならinnnerRadiusに重ならない
    const digit = folderCount[0].value.toString().length;
    const margin = (maxDigit - digit) * (fontSize / 2.8);
    const xpos = 90; // pieのinnerRadiusに文字がかかる基準値
    const x = xpos + margin;

    return (
      <g>
        <text x={x} y={110} textANchor="middle" fill="#777" fontSize={fontSize}>
          {folderCount[0].value}
        </text>
      </g>
    );
  };

  return (
    <div>
      <PieChart width={320} height={200}>
        <Pie
          data={folderCount}
          innerRadius={80}
          outerRadius={100}
          fill="#00C49F"/>
        {renderShape(folderCount)}
      </PieChart>
    </div>
  );
};

export default FolderCountPie;
