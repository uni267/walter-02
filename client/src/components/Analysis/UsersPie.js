import React from "react";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const UsersPie = ({users}) => {
  return (
    <PieChart width={300} height={200}>
      <Pie
        data={users}
        innerRadius={70}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={1}
        label>

        { users.map( (entry, idx) => (<Cell fill={entry.color} />) )}

    </Pie>
      <Tooltip />
      </PieChart>
  );
};

export default UsersPie;
