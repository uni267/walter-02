import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { schemeCategory20 } from "d3-scale";

const NoShapePie = ({data, cardWidth}) => {
  const renderCell = (entry, idx) => (
    <Cell fill={schemeCategory20[idx]} key={idx} />
  );

  const pieWidth = cardWidth - 32;

  return (
    <PieChart width={pieWidth} height={330}>
      <Pie
        data={data}
        innerRadius={80}
        outerRadius={120}
        fill="#8884d8"
        label>

        { data.map((entry, idx) => renderCell(entry, idx)) }

      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default NoShapePie;
