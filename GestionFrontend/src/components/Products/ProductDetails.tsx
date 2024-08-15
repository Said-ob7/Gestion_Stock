import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/Api/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IoIosArrowBack } from "react-icons/io";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

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

interface Product {
  id: number;
  nserie: string;
  model: string;
  productType: ProductType | null;
  commande: Commande | null;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    axios
      .get(`/Prod/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });

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

  const handleSelectChange = (name: string, value: string) => {
    if (name === "productType") {
      const selectedType = productTypes.find(
        (type) => type.id.toString() === value
      );
      setProduct((prevProduct) =>
        prevProduct
          ? { ...prevProduct, productType: selectedType || null }
          : null
      );
    } else if (name === "commande") {
      const selectedCommande = commandes.find(
        (commande) => commande.id.toString() === value
      );
      setProduct((prevProduct) =>
        prevProduct
          ? { ...prevProduct, commande: selectedCommande || null }
          : null
      );
    }
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
    <>
      <div className="flex flex-row items-center gap-[4px] my-4">
        <Link className="" to={"/products"}>
          <IoIosArrowBack />
        </Link>
        <Link className="" to={"/products"}>
          Retour
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 mx-8">Product Detail</h2>
      <div className="p-4 mx-14 w-[700px]">
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block font-bold mb-2 w-[150px]">N Serie:</label>
          <Input
            type="text"
            name="nserie"
            value={product.nserie}
            onChange={handleChange}
            className="p-2 h-14 border rounded w-[400px]"
          />
        </div>
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block font-bold w-[150px]">Type de Produit:</label>
          <Select
            onValueChange={(value) => handleSelectChange("productType", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue
                placeholder={product.productType?.name || "Select a Type"}
              />
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
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block font-bold w-[150px]">Commande:</label>
          <Select
            onValueChange={(value) => handleSelectChange("commande", value)}
          >
            <SelectTrigger className="w-[400px]">
              <SelectValue
                placeholder={
                  product.commande
                    ? `${product.commande.bonCommande.n_BC} - ${product.commande.bonLivraison.n_BL}`
                    : "Select a Commande"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {commandes.map((commande) => (
                  <SelectItem key={commande.id} value={commande.id.toString()}>
                    {commande.bonCommande.n_BC} - {commande.bonLivraison.n_BL}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block font-bold mb-2 w-[150px]">Model:</label>
          <Input
            type="text"
            name="model"
            value={product.model}
            onChange={handleChange}
            className="p-2 h-14 border rounded w-[400px]"
          />
        </div>
        <div className="flex justify-end mt-14">
          <Button onClick={handleSave} className="mr-2">
            Save
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="mr-2 bg-red-700 hover:bg-red-600 hover:text-white text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
