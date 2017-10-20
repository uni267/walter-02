import React from "react";

import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar
} from "recharts";

const UsagesBar = ({usage}) => {
  return (
    <BarChart width={1024} height={250} data={usage}>
      <XAxis dataKey="name" />
      <YAxis dataKey="threshold" />
      <CartesianGrid strokeDasharray="1 1" />
      <Tooltip />
      <Legend />
      <Bar
        barSize={45} dataKey="usage" fill="#8884d8" />
    </BarChart>
  );
};

export default UsagesBar;
