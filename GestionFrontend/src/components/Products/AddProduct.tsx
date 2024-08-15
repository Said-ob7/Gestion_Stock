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
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

interface ProductType {
  id: number;
  name: string;
}

interface BonCommande {
  id: number;
  n_BC: string;
}

interface BonLivraison {
  id: number;
  n_BL: string;
}

interface Commande {
  id: number;
  description: string;
  bonCommande: BonCommande;
  bonLivraison: BonLivraison;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    nserie: "",
    model: "",
    productType: {
      id: 0,
    },
    commande: {
      id: 0,
    },
    quantite: 0,
    affectation: "",
    dateAffectation: "", // Initialize as an empty string
  });

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    axios
      .get("/Prod/types")
      .then((response) => {
        setProductTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product types!", error);
      });

    axios
      .get("/commande")
      .then((response) => {
        setCommandes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching commandes!", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "quantite" ? parseInt(value, 10) : value, // Parse quantity as a number
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: { id: parseInt(value, 10) },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/Prod/add", product)
      .then(() => {
        console.log("Product added successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product!", error);
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
      <div className="mx-14">
        <h2 className="text-xl font-bold">Add Product</h2>
        <form className="mx-8 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex items-center">
              <label className="font-bold w-[130px]">N_Serie:</label>
              <Input
                className="w-[400px]"
                type="text"
                name="nserie"
                value={product.nserie}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Type:</label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("productType", value)
                }
              >
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
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Commande:</label>
              <Select
                onValueChange={(value) => handleSelectChange("commande", value)}
              >
                <SelectTrigger className="w-[400px]">
                  <SelectValue placeholder="Select a Commande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {commandes.map((commande) => (
                      <SelectItem
                        key={commande.id}
                        value={commande.id.toString()}
                      >
                        {commande.bonCommande.n_BC} -{" "}
                        {commande.bonLivraison.n_BL}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Model:</label>
              <Input
                className="w-[400px]"
                type="text"
                name="model"
                value={product.model}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Quantite:</label>
              <Input
                className="w-[400px]"
                type="number"
                name="quantite"
                value={product.quantite.toString()} // Convert number to string for input field
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Affectation:</label>
              <Input
                className="w-[400px]"
                type="text"
                name="affectation"
                value={product.affectation}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold w-[130px]">Date Affectation:</label>
              <Input
                className="w-[400px]"
                type="date"
                name="dateAffectation"
                value={product.dateAffectation}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button className="mt-4" type="submit">
            Add Product
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
