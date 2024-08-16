import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
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

// Define the type for each entry in chartData
interface ChartDataEntry {
  date: string;
  [key: string]: number | string; // Allows dynamic keys with string type and number values
}

const ChartComponent = () => {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("/Prod") // Adjust the API endpoint as needed
      .then((response) => {
        const products = response.data;

        // Extract unique product types
        const types: string[] = Array.from(
          new Set<string>(
            products.map(
              (product: { productType: { name: any } }) =>
                product.productType?.name || "Unknown"
            )
          )
        );

        // Sort products by uploadDate
        products.sort(
          (
            a: { commande: { uploadDate: string } },
            b: { commande: { uploadDate: string } }
          ) => {
            return (
              new Date(a.commande.uploadDate).getTime() -
              new Date(b.commande.uploadDate).getTime()
            );
          }
        );

        // Initialize an object to keep track of cumulative counts for each product type
        const cumulativeCounts: { [key: string]: number } = {};

        // Transform data to fit chart structure, counting the number of products for each type per date
        const formattedData = products.reduce(
          (
            acc: ChartDataEntry[],
            product: {
              commande: { uploadDate: string };
              productType: { name: string };
            }
          ) => {
            const date = product.commande?.uploadDate?.split("T")[0];
            if (!date) return acc;

            const productTypeName = product.productType?.name || "Unknown";

            let existingEntry = acc.find((entry) => entry.date === date);

            if (!existingEntry) {
              existingEntry = { date };

              // Start with the last accumulated counts or initialize to 0
              types.forEach((type) => {
                existingEntry![type] = cumulativeCounts[type] || 0;
              });

              acc.push(existingEntry);
            }

            // Increment the cumulative count of products for this type
            cumulativeCounts[productTypeName] =
              (cumulativeCounts[productTypeName] || 0) + 1;

            // Update the entry for the current date with the cumulative count
            existingEntry[productTypeName] = cumulativeCounts[productTypeName];

            return acc;
          },
          []
        );

        setProductTypes(types);
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={400}
        data={chartData}
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
        {productTypes.map((type, index) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={getRandomColor(index)}
            name={type}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Helper function to generate random colors for each product type
const getRandomColor = (index: number) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#2a9d8f",
    "#e63946",
    "#f4a261",
    "#457b9d",
    "#e76f51",
  ];
  return colors[index % colors.length];
};

export default ChartComponent;
