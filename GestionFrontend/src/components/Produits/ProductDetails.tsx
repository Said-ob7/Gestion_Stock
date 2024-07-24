import { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import keycloak from "@/Keycloak/Keycloak.tsx";
// types.ts
export interface Product {
    id?: number;
    type: string;
    model: string;
    noSerie: string;
    inventaire: number;
}


const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>({
        type: '',
        model: '',
        noSerie: '',
        inventaire: 0,
    }

);

    useEffect(() => {
        axios.get(`http://localhost:8083/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            }
        })
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the product details!', error);
            });
    }, [id]);

    if (!product) {
        return <div>trying to find products</div>;
    }

    return (
        <div>
            <h1><strong>{product.model} Details</strong></h1>
            <p>Type: {product.type}</p>
            <p>Model:  {product.model}</p>
            <p>No Serie:   {product.noSerie}</p>
            <p>Inventaire:    {product.inventaire}</p>


        </div>
    );
}

export default ProductDetails;
