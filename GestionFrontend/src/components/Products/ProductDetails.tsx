import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/Api/api";
import { Button } from "../ui/button";

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios
      .get(`/Prod/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });
  }, [id]);

  const handleDelete = () => {
    axios
      .delete(`/Prod/${id}`)
      .then(() => {
        navigate("/products");
      })
      .catch((error) => {
        console.error("There was an error deleting the product!", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, [name]: value } : null
    );
  };

  const handleSave = () => {
    if (product) {
      axios
        .put(`/Prod/${id}`, product)
        .then((response) => {
          setProduct(response.data);
          navigate("/products");
        })
        .catch((error) => {
          console.error("There was an error updating the product!", error);
        });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Detail</h2>
      <div className="mb-4">
        <label className="block mb-2">Serial Number</label>
        <input
          type="text"
          name="nserie"
          value={product.nserie}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Model</label>
        <input
          type="text"
          name="model"
          value={product.model}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Product Type</label>
        <input
          type="text"
          name="productType"
          value={product.productType?.name || ""}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="flex">
        <Button onClick={handleSave} variant="outline" className="mr-2">
          Save
        </Button>
        <Button onClick={handleDelete} variant="outline" className="mr-2">
          Delete
        </Button>
        <Button onClick={() => navigate("/products")} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
