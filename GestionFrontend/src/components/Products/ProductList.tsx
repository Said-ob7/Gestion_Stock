import { useEffect, useState } from "react";
import axios from "@/Api/api";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import * as XLSX from "xlsx";

interface Product {
  id: number;
  nserie: string;
  type: string;
  model: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("/Prod")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Serial Number</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Model</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.nserie}</td>
                <td className="py-2 px-4 border-b">{product.type}</td>
                <td className="py-2 px-4 border-b">{product.model}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button onClick={exportToExcel} className="mr-2">
          Export to Excel
        </Button>
        <Link to={"/products/new"}>
          <Button>Add New Product</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
