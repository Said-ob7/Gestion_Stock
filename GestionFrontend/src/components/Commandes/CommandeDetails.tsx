import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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

const CommandeDetails: React.FC = () => {
  const { keycloak } = useKeycloak();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const response = await axios.get<Commande>(
          `http://localhost:8787/api/commande/view/${id}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        setCommande(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching commande:", error);
        setIsLoading(false);
      }
    };

    if (id && keycloak.token) {
      fetchCommande();
    }
  }, [id, keycloak.token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8787/api/commande/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error deleting commande:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8787/api/commande/update/${id}`,
        commande,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      navigate("/orders");
    } catch (error) {
      console.error("Error updating commande:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl h-[400px] mx-auto mt-10 p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
      {commande ? (
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Commande Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <Input
                  className="w-full"
                  type="text"
                  value={commande.description}
                  onChange={(e) =>
                    setCommande({ ...commande, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N_BC:
                </label>
                <Input
                  className="w-[500px]"
                  type="text"
                  value={commande.bonCommande.n_BC}
                  onChange={(e) =>
                    setCommande({
                      ...commande,
                      bonCommande: {
                        ...commande.bonCommande,
                        n_BC: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N_BL:
                </label>
                <Input
                  className="w-[500px]"
                  type="text"
                  value={commande.bonLivraison.n_BL}
                  onChange={(e) =>
                    setCommande({
                      ...commande,
                      bonLivraison: {
                        ...commande.bonLivraison,
                        n_BL: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <Button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Update
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div>Commande not found</div>
      )}
    </div>
  );
};

export default CommandeDetails;
