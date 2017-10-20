import React from "react";

// recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const MimetypesPie = ({mimetypes, styles}) => {
  const colors = [
    "#d2584c", // 使用中
    "#00bcd4"  // 空き
  ];

  const renderCell = (color, idx) => (
    <Cell key={idx} fill={color} />
  );

  return (
    <PieChart width={styles.pie.width} height={styles.pie.height}>
      <Pie
        data={mimetypes}
        innerRadius={10}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={2}
        label >
        {colors.map( (color, idx) => renderCell(color, idx))}
      </Pie>
      <Tooltip />
    </PieChart>
  );

};

export default MimetypesPie;
