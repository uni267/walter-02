import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const UsagesArea = ({usages, cardWidth}) => {
  const areaWidth = cardWidth - 32;
  const areaHeight = areaWidth * 0.4;

  return (
    <AreaChart width={areaWidth} height={areaHeight} data={usages}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="1 1" />
      <Tooltip />
      <Area type='monotone' stackId={1} dataKey='usage' fill='#ff9896' stroke="#d62728" />
      <Area type="monotone" stackId={1} dataKey="free" fill="#aec7e8" stroke="#1f77b4" />
    </AreaChart>
  );
};

export default UsagesArea;
