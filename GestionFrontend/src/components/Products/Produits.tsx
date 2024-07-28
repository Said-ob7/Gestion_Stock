import React from "react";
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import ProductDetail from "./ProductDetails";

const Produits: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/new" element={<AddProduct />} />
      <Route path="/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default Produits;
