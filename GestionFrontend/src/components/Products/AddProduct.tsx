import React, { useState, useEffect } from "react";
import axios from "@/Api/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"; // Adjust the import path as needed

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productType: { id: parseInt(value, 10) },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting product:", product);
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
        <div className="flex flex-col gap-8">
          <div>
            <label>N_Serie:</label>
            <Input
              className="w-[400px]"
              type="text"
              name="nserie"
              value={product.nserie}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Type:</label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Model:</label>
            <Input
              className="w-[400px]"
              type="text"
              name="model"
              value={product.model}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button className="mt-4" type="submit">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
