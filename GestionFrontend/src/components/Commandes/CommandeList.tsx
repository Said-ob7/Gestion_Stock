import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";

interface Commande {
  id: number;
  description: string;
}

const CommandeList: React.FC = () => {
  const { keycloak } = useKeycloak();

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [selectedBonCommande, setSelectedBonCommande] = useState<string | null>(
    null
  );
  const [selectedBonLivraison, setSelectedBonLivraison] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Fetch the list of Commandes (you need to implement this endpoint in the backend)
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
      setSelectedBonCommande(fileURL);
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
      setSelectedBonLivraison(fileURL);
    } catch (error) {
      console.error("Error viewing BonLivraison:", error);
    }
  };

  return (
    <div>
      <ul>
        {commandes.map((commande) => (
          <li key={commande.id}>
            {commande.description}
            <button onClick={() => handleViewBonCommande(commande.id)}>
              View BonCommande
            </button>
            <button onClick={() => handleViewBonLivraison(commande.id)}>
              View BonLivraison
            </button>
          </li>
        ))}
      </ul>
      {selectedBonCommande && (
        <iframe
          src={selectedBonCommande}
          width="100%"
          height="500px"
          title="BonCommande Viewer"
        ></iframe>
      )}
      {selectedBonLivraison && (
        <iframe
          src={selectedBonLivraison}
          width="100%"
          height="500px"
          title="BonLivraison Viewer"
        ></iframe>
      )}
    </div>
  );
};

export default CommandeList;
