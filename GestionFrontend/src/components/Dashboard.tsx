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
  fill: string;
}

const Dashboard = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/Prod")
      .then((response) => {
        const products: Product[] = response.data;

        // Handle empty response or invalid data
        if (!Array.isArray(products) || products.length === 0) {
          console.warn("No products found or invalid data.");
          return;
        }

        // Count the number of products for each product type
        const productQuantities: { [key: string]: number } = products.reduce(
          (acc, product) => {
            const type = product.productType?.name || "Unknown";
            if (!acc[type]) {
              acc[type] = 0;
            }
            acc[type] += 1; // Increment the count for the product type
            return acc;
          },
          {} as { [key: string]: number }
        );

        // Convert the product quantities into chart data format
        const chartData: ChartData[] = Object.entries(productQuantities).map(
          ([name, quantity], index) => ({
            name,
            quantity,
            fill: COLORS[index % COLORS.length], // Assign colors from the COLORS array
          })
        );

        setData(chartData);

        // Calculate the maximum quantity for the YAxis domain
        const maxQuantity = Math.max(...Object.values(productQuantities), 0);
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
              domain={[0, maxQuantity + 2]}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" barSize={50}>
              {data.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
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
                <Cell key={`pie-cell-${index}`} fill={entry.fill} />
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
