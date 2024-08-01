import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegFilePdf, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

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
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {commandes.map((commande) => (
          <Link to={`/orders/${commande.id}`} key={commande.id}>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-[250px] flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Commande #{commande.id}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {commande.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">N_BC:</span>{" "}
                  {commande.bonCommande.n_BC}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">N_BL:</span>{" "}
                  {commande.bonLivraison.n_BL}
                </p>
              </div>
              <div className="flex justify-between">
                <Button
                  className="flex items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewBonCommande(commande.id);
                  }}
                >
                  <FaRegFilePdf />
                  BonCommande
                </Button>
                <Button
                  className="flex items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewBonLivraison(commande.id);
                  }}
                >
                  <FaRegFilePdf />
                  BonLivraison
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link className="fixed bottom-14 right-14" to={"/orders/upload"}>
        <Button className="bg-orange-600 hover:bg-orange-500">
          <FaPlus />
        </Button>
      </Link>
    </div>
  );
};

export default CommandeList;
