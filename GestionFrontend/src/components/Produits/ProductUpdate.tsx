import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import keycloak from "@/Keycloak/Keycloak.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        type: '',
        model: '',
        noSerie: '',
        inventaire: ''
    });

    useEffect(() => {
        axios.get(`/api/products/${id}`, {
            headers:{
                Authorization: `Bearer ${keycloak.token}`,
            }
        })
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        axios.put(`/api/products/${id}`, product, {headers:
                {
                    Authorization : `Bearer ${keycloak.token}`,
                }})
            .then(response => {
                console.log('Product updated:', response.data);
                navigate('/');
            })
            .catch(error => console.error('Error updating product:', error));
    };

    return (
        <div>
            <h1>Update Product</h1>
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
                        value={product.type}
                        onChange={handleChange}

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

                        value={product.model}
                        onChange={handleChange}

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

                        value={product.noSerie}
                        onChange={handleChange}

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

                        value={product.inventaire}
                        onChange={handleChange}

                    />
                </div>
                    <div className="flex justify-end m-14 gap-8">
                        <Button type="submit" className="w-32">
                            Update
                        </Button>
                    </div>
            </form>
        </div>
);
};

export default UpdateProduct;

