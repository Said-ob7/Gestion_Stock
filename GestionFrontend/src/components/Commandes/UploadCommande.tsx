import React, { useState, useCallback } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const UploadCommande: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [description, setDescription] = useState<string>("");
  const [bonCommandeFile, setBonCommandeFile] = useState<File | null>(null);
  const [nBC, setNBC] = useState<string>("");
  const [bonLivraisonFile, setBonLivraisonFile] = useState<File | null>(null);
  const [nBL, setNBL] = useState<string>("");
  const [dateLivraison, setDateLivraison] = useState<string>("");

  const onDropBonCommande = useCallback((acceptedFiles: File[]) => {
    setBonCommandeFile(acceptedFiles[0]);
  }, []);

  const onDropBonLivraison = useCallback((acceptedFiles: File[]) => {
    setBonLivraisonFile(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getRootPropsBonCommande,
    getInputProps: getInputPropsBonCommande,
  } = useDropzone({
    onDrop: onDropBonCommande,
    accept: { "application/pdf": [".pdf"] },
  });

  const {
    getRootProps: getRootPropsBonLivraison,
    getInputProps: getInputPropsBonLivraison,
  } = useDropzone({
    onDrop: onDropBonLivraison,
    accept: { "application/pdf": [".pdf"] },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (bonCommandeFile) {
      formData.append("bonCommande", bonCommandeFile);
    }
    formData.append("nBC", nBC);
    if (bonLivraisonFile) {
      formData.append("bonLivraison", bonLivraisonFile);
    }
    formData.append("nBL", nBL);
    formData.append("dateLivraison", dateLivraison);

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
      <h2 className="text-xl font-bold mb-4">Ajouter une Commande :</h2>
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
        <div
          {...getRootPropsBonCommande()}
          className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center flex items-center cursor-pointer min-h-[150px]"
        >
          <input {...getInputPropsBonCommande()} className="hidden" />
          {bonCommandeFile ? (
            <p className="text-sm text-gray-700">{bonCommandeFile.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag 'n' drop a Bon Commande PDF here, or click to select one
            </p>
          )}
        </div>
        <Input
          type="text"
          value={nBL}
          onChange={(e) => setNBL(e.target.value)}
          placeholder="N_BL"
        />
        <div
          {...getRootPropsBonLivraison()}
          className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center flex items-center cursor-pointer min-h-[150px]"
        >
          <input {...getInputPropsBonLivraison()} className="hidden" />
          {bonLivraisonFile ? (
            <p className="text-sm text-gray-700">{bonLivraisonFile.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag 'n' drop a Bon Livraison PDF here, or click to select one
            </p>
          )}
        </div>
        <input
          type="date"
          value={dateLivraison}
          onChange={(e) => setDateLivraison(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>
      <Button type="submit" className="mb-8">
        Upload
      </Button>
    </form>
  );
};

export default UploadCommande;
