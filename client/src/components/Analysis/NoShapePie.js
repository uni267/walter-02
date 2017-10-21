import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { schemeCategory20 } from "d3-scale";

const NoShapePie = ({data, cardWidth}) => {
  const renderCell = (entry, idx) => (
    <Cell fill={schemeCategory20[idx]} key={idx} />
  );

  const pieWidth = cardWidth - 32;
  const pieHeight = pieWidth * 0.65;

  return (
    <PieChart width={pieWidth} height={pieHeight}>
      <Pie
        data={data}
        outerRadius="70%"
        fill="#8884d8"
        label>

        { data.map((entry, idx) => renderCell(entry, idx)) }

      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default NoShapePie;
