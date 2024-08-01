import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
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
import ChartComponent from "./Chart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6347"];

interface Product {
  productType: { name: string };
}

interface ChartData {
  name: string;
  quantity: number;
}

const Dashboard = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/Prod")
      .then((response) => {
        const products: Product[] = response.data;
        const productQuantities: { [key: string]: number } = products.reduce(
          (acc, product) => {
            const type = product.productType?.name || "Unknown";
            if (!acc[type]) {
              acc[type] = 0;
            }
            acc[type]++;
            return acc;
          },
          {} as { [key: string]: number }
        );

        const chartData: ChartData[] = Object.entries(productQuantities).map(
          ([name, quantity]) => ({
            name,
            quantity: quantity as number, // Cast quantity to number
          })
        );

        setData(chartData);

        // Find the maximum quantity and set it
        const maxQuantity = Math.max(...Object.values(productQuantities));
        setMaxQuantity(maxQuantity);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <>
      <ChartComponent />
      <div className="flex flex-row">
        <div className="chart-container">
          <h3 className="mb-6">Product Quantities</h3>
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
            <YAxis
              tickFormatter={(tick) => tick.toString()}
              domain={[0, maxQuantity + 5]}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#2a9d8f" />
          </BarChart>
        </div>

        <div className="flex flex-col justify-center">
          <h3>Product Distribution</h3>
          <PieChart width={600} height={300}>
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
    </>
  );
};

export default Dashboard;
