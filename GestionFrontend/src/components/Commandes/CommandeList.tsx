import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegFilePdf } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

interface Commande {
  id: number;
  description: string;
}

const CommandeList: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get<Commande[]>(
          "http://localhost:8787/api/commande",
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        setCommandes(response.data);
      } catch (error) {
        console.error("Error fetching commandes:", error);
      }
    };

    fetchCommandes();
  }, [keycloak.token]);

  const handleViewBonCommande = async (id: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8787/api/commande/download/bonCommande/${id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing BonCommande:", error);
    }
  };

  const handleViewBonLivraison = async (id: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8787/api/commande/download/bonLivraison/${id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing BonLivraison:", error);
    }
  };

  return (
    <div>
      <ul className="mb-8">
        {commandes.map((commande) => (
          <li className="flex flex-col gap-4" key={commande.id}>
            {commande.description}
            <div className="flex flex-row gap-4">
              <Button
                className="flex flex-row gap-4 bg-red-600 hover:bg-red-500"
                onClick={() => handleViewBonCommande(commande.id)}
              >
                <FaRegFilePdf />
                BonCommande
              </Button>
              <Button
                className="flex flex-row gap-4 bg-red-600 hover:bg-red-500"
                onClick={() => handleViewBonLivraison(commande.id)}
              >
                <FaRegFilePdf />
                BonLivraison
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Link className="fixed bottom-14 right-14" to={"/orders/upload"}>
        <Button className="bg-orange-600 hover:bg-orange-500">
          <FaPlus />
        </Button>
      </Link>
    </div>
  );
};

export default CommandeList;
