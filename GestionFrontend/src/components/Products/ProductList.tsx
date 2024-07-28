import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  nserie: string;
  model: string;
  productType: ProductType | null;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({ nserie: "", type: "", model: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/Prod")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value.toLowerCase() };

      const newFilteredProducts = products.filter(
        (product) =>
          product.nserie.toLowerCase().includes(newFilters.nserie) &&
          (product.productType?.name.toLowerCase() || "").includes(
            newFilters.type
          ) &&
          product.model.toLowerCase().includes(newFilters.model)
      );

      setFilteredProducts(newFilteredProducts);
      setCurrentPage(1);
      return newFilters;
    });
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        const newSelected = new Set(
          filteredProducts.map((product) => product.id)
        );
        setSelectedProducts(newSelected);
      } else {
        setSelectedProducts(new Set());
      }
      return newSelectAll;
    });
  };

  const handleDeleteProduct = (id: number) => {
    axios
      .delete(`/Prod/${id}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setSelectedProducts((prevSelected) => {
          const newSelected = new Set(prevSelected);
          newSelected.delete(id);
          return newSelected;
        });
      })
      .catch((error) => {
        console.error("There was an error deleting the product!", error);
      });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.addRow([
      "N° BC",
      "N° BL",
      "Date livraison BL",
      "Quantité",
      "Type matériel",
      "Model",
      "N° SERIE",
      "Inventaire CIH",
      "Identifiant",
      "Type",
      "AFFECTATION",
      "DATE d'affectation",
    ]);

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFBF00" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FF000000" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    filteredProducts.forEach((product) => {
      if (selectedProducts.has(product.id)) {
        worksheet.addRow([
          "",
          "",
          "",
          "",
          product.productType?.name || "",
          product.model,
          product.nserie,
          "",
          "",
          product.productType?.name || "",
          "",
          "",
        ]);
      }
    });

    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "products.xlsx");
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentPageItems = filteredProducts.slice(
    offset,
    offset + itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          name="nserie"
          value={filters.nserie}
          onChange={handleFilterChange}
          placeholder="Filter by Serial Number"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          placeholder="Filter by Type"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          placeholder="Filter by Model"
          className="p-2 border rounded"
        />
        <Button
          onClick={exportToExcel}
          variant="outline"
          className="ml-2 bg-emerald-400 hover:bg-emerald-300"
        >
          <RiFileExcel2Line />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-r border-b">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="form-checkbox"
                />
              </th>
              <th className="py-2 px-4 border-r border-b">ID</th>
              <th className="py-2 px-4 border-r border-b">N Serie</th>
              <th className="py-2 px-4 border-r border-b">Type</th>
              <th className="py-2 px-4 border-r border-b">Model</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-r border-b">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="form-checkbox"
                  />
                </td>
                <td className="py-2 px-4 border-r border-b">{product.id}</td>
                <td className="py-2 px-4 border-r border-b">
                  {product.nserie}
                </td>
                <td className="py-2 px-4 border-r border-b">
                  {product.productType?.name || "N/A"}
                </td>
                <td className="py-2 px-4 border-r border-b">{product.model}</td>
                <td className="py-2 px-4 border-b">
                  <Button
                    onClick={() => navigate(`/products/${product.id}`)}
                    variant="outline"
                    className="mr-2"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="outline"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="mt-4 flex">
        <Link className="fixed bottom-14 right-14" to={"/products/new"}>
          <Button className="bg-orange-600 hover:bg-orange-500">
            <FaPlus />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
