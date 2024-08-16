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

interface ProductData {
  commande?: {
    uploadDate?: string;
  };
  productType?: {
    name?: string;
  };
  quantite: number;
}

interface ChartData {
  [key: string]: number | string;
  date: string;
}

const ChartComponent = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("/Prod") // Adjust the API endpoint as needed
      .then((response) => {
        const products: ProductData[] = response.data;

        // Sort products by date to ensure cumulative calculation is correct
        products.sort((a, b) => {
          const dateA = new Date(a.commande?.uploadDate || "");
          const dateB = new Date(b.commande?.uploadDate || "");
          return dateA.getTime() - dateB.getTime();
        });

        // Extract unique product types
        const types: string[] = Array.from(
          new Set<string>(
            products.map((product) => product.productType?.name || "Unknown")
          )
        );

        // Transform data to fit chart structure, summing up quantite for each product type per date
        const formattedData: ChartData[] = [];
        const cumulativeQuantities: { [key: string]: number } = {};

        products.forEach((product) => {
          const date = product.commande?.uploadDate?.split("T")[0];
          if (!date) return;

          const productTypeName = product.productType?.name || "Unknown";
          cumulativeQuantities[productTypeName] =
            (cumulativeQuantities[productTypeName] || 0) + product.quantite;

          const existingEntry = formattedData.find(
            (entry) => entry.date === date
          );

          if (existingEntry) {
            existingEntry[productTypeName] =
              cumulativeQuantities[productTypeName];
          } else {
            const newEntry: ChartData = { date };
            types.forEach((type) => {
              newEntry[type] = cumulativeQuantities[type] || 0;
            });
            formattedData.push(newEntry);
          }
        });

        // Fill in gaps for missing dates (if needed) by carrying forward the cumulative totals
        const finalData: ChartData[] = [];
        let previousEntry: ChartData | undefined;

        formattedData.forEach((entry) => {
          const newEntry: ChartData = { date: entry.date };

          types.forEach((type) => {
            newEntry[type] =
              entry[type] !== undefined
                ? entry[type]
                : previousEntry?.[type] || 0;
          });

          finalData.push(newEntry);
          previousEntry = newEntry;
        });

        setProductTypes(types);
        setChartData(finalData);
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
