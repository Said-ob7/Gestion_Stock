import React, { useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";

const UploadForm: React.FC = () => {
  const { keycloak } = useKeycloak();

  const [description, setDescription] = useState<string>("");
  const [bonCommandeFile, setBonCommandeFile] = useState<File | null>(null);
  const [bonLivraisonFile, setBonLivraisonFile] = useState<File | null>(null);

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
    if (bonLivraisonFile) {
      formData.append("bonLivraison", bonLivraisonFile);
    }

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
    } catch (error) {
      console.error("Error uploading commande:", error);
      alert("Failed to upload commande");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileChange(e, setBonCommandeFile)}
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileChange(e, setBonLivraisonFile)}
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
