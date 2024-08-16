import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegFilePdf, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BonCommande {
  id: number;
  n_BC: string;
}

interface BonLivraison {
  id: number;
  n_BL: string;
  dateLivraison: string;
}

interface Commande {
  id: number;
  description: string;
  bonCommande: BonCommande;
  bonLivraison: BonLivraison;
  uploadDate: string;
}

const CommandeList: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

        const formattedCommandes = response.data.map((commande) => ({
          ...commande,
          bonLivraison: {
            ...commande.bonLivraison,
            dateLivraison: commande.bonLivraison.dateLivraison
              ? format(
                  new Date(commande.bonLivraison.dateLivraison),
                  "dd-MM-yyyy"
                )
              : "N/A", // Set to "N/A" if dateLivraison is missing or null
          },
        }));

        setCommandes(formattedCommandes);
        console.log(formattedCommandes);
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

  const totalPages = Math.ceil(commandes.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentPageItems = commandes.slice(offset, offset + itemsPerPage);

  return (
    <div className="p-6 ">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPageItems.map((commande) => (
          <Link to={`/orders/${commande.id}`} key={commande.id}>
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-[250px] flex flex-col justify-between border-black">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Commande #{commande.id}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {commande.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-400">N_BC:</span>{" "}
                  {commande.bonCommande.n_BC}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-400">N_BL:</span>{" "}
                  {commande.bonLivraison.n_BL}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-400">
                    Date Livraison:
                  </span>{" "}
                  {commande.bonLivraison.dateLivraison}
                </p>
              </div>
              <div className="flex justify-between">
                <Button
                  className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewBonCommande(commande.id);
                  }}
                >
                  <FaRegFilePdf />
                  BonCommande
                </Button>
                <Button
                  className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500"
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

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Link className="fixed bottom-8 right-8" to={"/orders/upload"}>
        <Button className="bg-orange-600 hover:bg-orange-500">
          <FaPlus />
        </Button>
      </Link>
    </div>
  );
};

export default CommandeList;
