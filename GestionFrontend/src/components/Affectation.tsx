import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "../components/ui/input";
import { MdEditNote } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  nserie: string;
  model: string;
  productType: ProductType | null;
  commande: Commande | null;
  quantite: number;
  identifiant: string;
  affectation: string | null;
  dateAffectation: string | null;
}

interface BonCommande {
  id: number;
  n_BC: string;
}

interface BonLivraison {
  id: number;
  n_BL: string;
  dateLivraison: string;
}

interface Commande {
  id: number;
  bonCommande: BonCommande;
  bonLivraison: BonLivraison;
}

interface User {
  id: number;
  matricule: string;
  email: string;
  firstName: string;
  lastName: string;
}

const Affectation: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTypes, setProductTypes] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ nserie: "", type: "", model: "" });
  const [users, setUsers] = useState<User[]>([]); // State for users
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products
    axios
      .get("/Prod")
      .then((response) => {
        const productsWithoutAffectation = response.data.filter(
          (product: Product) => !product.affectation
        );
        setProducts(productsWithoutAffectation);
        setFilteredProducts(productsWithoutAffectation);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });

    // Fetch commandes
    axios
      .get("/commande")
      .then((response) => {
        const commandes = response.data;
        setProducts((prevProducts) =>
          prevProducts.map((product) => ({
            ...product,
            commande: commandes.find(
              (commande: Commande) => commande.id === product.commande?.id
            ),
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching commandes!", error);
      });

    // Fetch product types
    axios
      .get("/productTypes")
      .then((response) => {
        setProductTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product types!", error);
      });

    // Fetch users
    axios
      .get("/User")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users!", error);
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

  const handleInputChange = (
    id: number,
    field: keyof Product,
    value: string
  ) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };
  const handleSelectChange = (
    field: keyof Product,
    value: string,
    id: number
  ) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const handleSave = (product: Product) => {
    // Validate affectation and dateAffectation
    if (
      (product.affectation && !product.dateAffectation) ||
      (!product.affectation && product.dateAffectation)
    ) {
      alert(
        "Both Affectation and Date Affectation must be filled or both must be empty."
      );
      return;
    }

    axios
      .put(`/Prod/${product.id}`, {
        nserie: product.nserie, // Ensure nserie is sent
        model: product.model, // Ensure model is sent
        affectation: product.affectation,
        dateAffectation: product.dateAffectation,
      })
      .then((response) => {
        const updatedProduct = response.data;

        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...product, ...updatedProduct } : p
          )
        );

        setFilteredProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...product, ...updatedProduct } : p
          )
        );

        alert("Product updated successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error updating the product!", error);
      });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentPageItems = filteredProducts.slice(
    offset,
    offset + itemsPerPage
  );

  return (
    <div className="">
      <div className="mb-2 flex items-center">
        <Input
          type="text"
          name="nserie"
          value={filters.nserie}
          onChange={handleFilterChange}
          placeholder="Filter by Serial Number"
          className="mr-2 p-2 border rounded"
        />
        <Input
          type="text"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          placeholder="Filter by Type"
          className="mr-2 p-2 border rounded"
        />
        <Input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          placeholder="Filter by Model"
          className="p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 h-14">
              <th className="py-2 px-2 border-r border-b">N_BC</th>
              <th className="py-2 px-2 border-r border-b">N_BL</th>
              <th className="py-2 px-2 border-r border-b">Date</th>
              <th className="py-2 px-2 border-r border-b">N Serie</th>
              <th className="py-2 px-2 border-r border-b">Type</th>
              <th className="py-2 px-2 border-r border-b">Model</th>
              <th className="py-2 px-2 border-r border-b">Identifiant</th>
              <th className="py-2 px-2 border-r border-b">Affectation</th>
              <th className="py-2 px-2 border-r border-b">Date Affectation</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.commande?.bonCommande.n_BC || "N/A"}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.commande?.bonLivraison.n_BL || "N/A"}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.commande?.bonLivraison.dateLivraison
                    ? formatDate(product.commande.bonLivraison.dateLivraison)
                    : "N/A"}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.nserie}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.productType?.name || "N/A"}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.model}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  {product.identifiant}
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  <Select
                    value={product.affectation || ""}
                    onValueChange={(value) =>
                      handleSelectChange("affectation", value, product.id)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.lastName}>
                            {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-2 border-r border-b text-center">
                  <Input
                    type="date"
                    value={
                      product.dateAffectation ? product.dateAffectation : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        product.id,
                        "dateAffectation",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded"
                  />
                </td>
                <td className="py-2 px-2 border-b text-center">
                  <Button
                    onClick={() => handleSave(product)}
                    className=" text-white p-2 rounded"
                  >
                    Save
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
    </div>
  );
};

export default Affectation;
