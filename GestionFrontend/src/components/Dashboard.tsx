import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Laptops", quantity: 50 },
  { name: "Phones", quantity: 30 },
  { name: "Scanners", quantity: 20 },
  { name: "Screens", quantity: 40 },
  { name: "Tablets", quantity: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6347"];

function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="chart-container">
        <h3>Product Quantities</h3>
        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="flex flex-col justify-center">
        <h3>Product Distribution</h3>
        <PieChart className="" width={600} height={300}>
          <Pie
            data={data}
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="quantity"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}

export default Dashboard;
