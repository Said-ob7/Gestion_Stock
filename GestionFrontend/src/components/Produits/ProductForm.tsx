import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IoIosArrowBack } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import keycloak from "@/Keycloak/Keycloak.tsx";

const ProductForm: React.FC = () => {
    const [produit, setProduit] = useState({
        type: '',
        model: '',
        noSerie: '',
        inventaire: 0 });
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduit({ ...produit, [name]: value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8083/api/products', produit,{

            headers:{
                Authorization : `Bearer ${keycloak.token}`,},}
        )
            .then(() => {
                navigate('/products');  // Corrected to navigate to the products list
            })
            .catch(error => {
                console.error('There was an error creating the product!', error);
            });
    };

    return (
        <>
            <div className="flex flex-row items-center gap-[4px] my-4">
                <Link to={"/products"}>
                    <IoIosArrowBack />
                </Link>
                <Link to={"/products"}>Retour</Link>
            </div>
            <div className="w-[700px] mx-14">
                <h2 className="text-xl font-bold">Create new product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4 flex flex-row items-center">
                        <label className="w-28" htmlFor="type">
                            Type :
                        </label>
                        <Input
                            className="w-[500px] h-14 m-4"
                            type="text"
                            name="type"
                            id="type"
                            value={produit.type}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-4 flex flex-row items-center">
                        <label className="w-28" htmlFor="model">
                            Model :
                        </label>
                        <Input
                            className="w-[500px] h-14 mx-4"
                            type="text"
                            name="model"

                            value={produit.model}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-4 flex flex-row items-center">
                        <label className="w-28" htmlFor="noSerie">
                            NoSerie :
                        </label>
                        <Input
                            className="w-[500px] h-14 mx-4"
                            type="text"
                            name="noSerie"

                            value={produit.noSerie}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-4 flex flex-row items-center">
                        <label className="w-28" htmlFor="inventaire">
                            Inventaire :
                        </label>
                        <Input
                            className="w-[500px] h-14 mx-4"
                            type="number"
                            name="inventaire"

                            value={produit.inventaire}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-end m-14 gap-8">
                        <Button type="submit" className="w-32">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
