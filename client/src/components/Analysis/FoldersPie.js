import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const FoldersPie = ({folders, styles}) => {
  const renderCell = (entry, idx) => (
    <Cell fill={entry.color} key={idx} />
  );

  return (
    <PieChart width={styles.pie.width} height={styles.pie.height}>
      <Pie
        data={folders}
        innerRadius={70}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={1}
        label>

        { folders.map( (entry, idx) => renderCell(entry, idx) ) }
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default FoldersPie;
