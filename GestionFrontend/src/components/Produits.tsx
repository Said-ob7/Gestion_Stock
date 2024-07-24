import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductForm from '@/components/Produits/ProductForm';
import ProductList from '@/components/Produits/ProductList';
import ProductDetails from "@/components/Produits/ProductDetails.tsx";
import ProductUpdate from "@/components/Produits/ProductUpdate.tsx";


const Produits: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/new" element={<ProductForm />} />
            <Route path="/:id" element={<ProductDetails />} />
            <Route path="/:id/details" element={<ProductUpdate />} />
        </Routes>
    );
}

export default Produits;
