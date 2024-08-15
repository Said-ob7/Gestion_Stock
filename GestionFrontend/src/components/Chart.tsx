import React from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "2024-01-01", Laptop: 400, Tablet: 300, Phone: 200, Desktop: 547 },
  { date: "2024-01-02", Laptop: 300, Tablet: 200, Phone: 278, Desktop: 345 },
  { date: "2024-01-03", Laptop: 200, Tablet: 278, Phone: 189, Desktop: 172 },
  { date: "2024-01-04", Laptop: 278, Tablet: 189, Phone: 239, Desktop: 547 },
  { date: "2024-01-05", Laptop: 189, Tablet: 239, Phone: 349, Desktop: 625 },
  { date: "2024-01-06", Laptop: 239, Tablet: 349, Phone: 600, Desktop: 245 },
  { date: "2024-02-06", Laptop: 239, Tablet: 349, Phone: 243, Desktop: 546 },
  { date: "2024-02-20", Laptop: 268, Tablet: 698, Phone: 243, Desktop: 134 },
  { date: "2024-03-06", Laptop: 239, Tablet: 546, Phone: 174, Desktop: 425 },
];

const ChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Laptop" stroke="#8884d8" />
        <Line type="monotone" dataKey="Tablet" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Phone" stroke="#ffc658" />
        <Line type="monotone" dataKey="Desktop" stroke="#2a9d8f" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
