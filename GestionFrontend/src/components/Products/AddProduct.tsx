import React, { useState } from "react";
import axios from "@/Api/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Define the Product type
interface Product {
  id?: number;
  nserie: string;
  type: string;
  model: string;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    nserie: "",
    type: "",
    model: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Submitting product:", product);
    axios
      .post("/Prod/add", product)
      .then(() => {
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
          <Input
            type="text"
            name="type"
            value={product.type}
            onChange={handleChange}
          />
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
