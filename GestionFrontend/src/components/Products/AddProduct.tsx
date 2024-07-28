import React, { useState, useEffect } from "react";
import axios from "@/Api/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ProductType {
  id: number;
  name: string;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    nserie: "",
    model: "",
    productType: {
      id: 0,
    },
  });

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    axios
      .get("/Prod/types")
      .then((response) => {
        setProductTypes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product types!", error);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "productType.id") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        productType: { id: parseInt(value, 10) },
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting product:", product); // Add this line to log the product
    axios
      .post("/Prod/add", product)
      .then(() => {
        console.log("Product added successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error adding the product!", error);
      });
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>N_Serie:</label>
          <Input
            type="text"
            name="nserie"
            value={product.nserie}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Type:</label>
          <select
            name="productType.id"
            value={product.productType.id}
            onChange={handleChange}
          >
            <option value={0}>Select a Type</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Model:</label>
          <Input
            type="text"
            name="model"
            value={product.model}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
};

export default AddProduct;
