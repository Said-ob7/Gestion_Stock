import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import keycloak from "@/Keycloak/Keycloak.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FaPlus} from "react-icons/fa";

export interface Product {
    id: number;
    type: string;
    model: string;
    noSerie: string;
    inventaire: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8083/api/products',{

                    headers:{
                        Authorization : `Bearer ${keycloak.token}`,},})

                setProducts(response.data);
            } catch (err) {
                setError('There was an error fetching the products!');
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <div>
                <h1>Product List</h1>
                {error && <p className="text-red-500">{error}</p>}

                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                <div
                                    style={{backgroundColor: "#f8f9fa"}}
                                    className="h-14 w-[1200px] flex flex-row items-center gap-[200px] rounded-md shadow"
                                >
                                    <div className="name w-[150px]   font-bold flex flex-row items-center gap-4">
                                        <p className="font-sans uppercase ">{product.model}</p>
                                    </div>
                                    <p > {product.type}</p>
                                    <p >{product.inventaire}</p>
                                    <p >{product.noSerie}</p>
                                    <p>
                                        <Link  to="/products/${id}/details">
                                            <Button>
                                                <FaPlus/>
                                            </Button>
                                        </Link>
                                    </p>
                                </div>

                            </Link>
                        </li>

                    ))}
                </ul>
            </div>
            <Link className="fixed bottom-14 right-14" to="/products/new">
                <Button>
                    <FaPlus/>
                </Button>
            </Link>

    </>);

};

export default ProductList;

