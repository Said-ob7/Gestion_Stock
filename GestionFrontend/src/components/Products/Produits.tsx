import React from "react";
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";

const Produits: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/new" element={<AddProduct />} />
    </Routes>
  );
};

export default Produits;