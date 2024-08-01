import React, { useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const UploadCommande: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [description, setDescription] = useState<string>("");
  const [bonCommandeFile, setBonCommandeFile] = useState<File | null>(null);
  const [nBC, setNBC] = useState<string>(""); // New state for N_BC
  const [bonLivraisonFile, setBonLivraisonFile] = useState<File | null>(null);
  const [nBL, setNBL] = useState<string>(""); // New state for N_BL

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (bonCommandeFile) {
      formData.append("bonCommande", bonCommandeFile);
    }
    formData.append("N_BC", nBC); // Ensure the key matches the backend
    if (bonLivraisonFile) {
      formData.append("bonLivraison", bonLivraisonFile);
    }
    formData.append("N_BL", nBL); // Ensure the key matches the backend

    try {
      const response = await axios.post(
        "http://localhost:8787/api/commande/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      alert(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading commande:", error);
      alert("Failed to upload commande");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une Commande :</h2>
      <div className="flex flex-col gap-8 w-[700px] my-4">
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Input
          type="text"
          value={nBC}
          onChange={(e) => setNBC(e.target.value)}
          placeholder="N_BC"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, setBonCommandeFile)}
        />
        <Input
          type="text"
          value={nBL}
          onChange={(e) => setNBL(e.target.value)}
          placeholder="N_BL"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, setBonLivraisonFile)}
        />
      </div>
      <Button type="submit">Upload</Button>
    </form>
  );
};

export default UploadCommande;
