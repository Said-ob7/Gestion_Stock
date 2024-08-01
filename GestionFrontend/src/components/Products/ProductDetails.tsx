import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/Api/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IoIosArrowBack } from "react-icons/io";

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
          <label className="block font-bold mb-2 w-[150px]"> N Serie :</label>
          <Input
            type="text"
            name="nserie"
            value={product.nserie}
            onChange={handleChange}
            className="p-2 h-14 border rounded w-[400px]"
          />
        </div>
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block mb-2 font-bold  w-[150px]">Model :</label>
          <Input
            type="text"
            name="model"
            value={product.model}
            onChange={handleChange}
            className="p-2 h-14 border rounded w-[400px]"
          />
        </div>
        <div className="my-8 flex flex-row items-center gap-4">
          <label className="block mb-2 font-bold w-[150px]">
            Type de Produit :
          </label>
          <Input
            type="text"
            name="productType"
            value={product.productType?.name || ""}
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
            className="mr-2 bg-red-700 hover:bg-red-600 hover:text-white text-white "
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
