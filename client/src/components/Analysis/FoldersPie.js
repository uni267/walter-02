import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const FoldersPie = ({folders}) => {
  const renderCell = (entry, idx) => (
    <Cell fill={entry.color} key={idx} />
  );

  return (
    <PieChart width={330} height={330}>
      <Pie
        data={folders}
        innerRadius={90}
        outerRadius={110}
        fill="#8884d8"
        label>

        { folders.map( (entry, idx) => renderCell(entry, idx) ) }
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default FoldersPie;
