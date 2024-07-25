import React, { useState, useEffect } from 'react';
import axios from 'axios';
import keycloak from '@/Keycloak/Keycloak';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MdModeEdit } from "react-icons/md";

interface Commande {
  idbc: number;
  numL: string;
  dte: string;
  BonCpdfPath: string | null;
  BonLpdfPath: string | null;
}

const Commandes = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [nouvelleCommande, setNouvelleCommande] = useState<Commande>({
    idbc: 0,
    numL: "",
    dte: "",
    BonCpdfPath: null,
    BonLpdfPath: null,
  });
  const [formVisible, setFormVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [commandeEnModification, setCommandeEnModification] = useState<Commande | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'BonCpdfPath' || name === 'BonLpdfPath') {
      // Gestion des fichiers
      setNouvelleCommande(prev => ({
        ...prev,
        [name]: files ? files[0] : null
      }));
    } else {
      // Gestion des champs de texte
      setNouvelleCommande(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleModifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'BonCpdfPath' || name === 'BonLpdfPath') {
      // Gestion des fichiers
      setCommandeEnModification(prev => ({
        ...prev!,
        [name]: files ? files[0] : null
      }));
    } else {
      // Gestion des champs de texte
      setCommandeEnModification(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    if (!nouvelleCommande.numL) {
      errors.numL = "Le numéro de commande est requis";
      valid = false;
    }
    if (!nouvelleCommande.dte) {
      errors.dte = "La date de commande est requise";
      valid = false;
    }
    if (!nouvelleCommande.BonCpdfPath) {
      errors.BonCpdfPath = "Le fichier bon de commande est requis";
      valid = false;
    }
    if (!nouvelleCommande.BonLpdfPath) {
      errors.BonLpdfPath = "Le fichier bon de livraison est requis";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleAjouterCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    if (nouvelleCommande.BonCpdfPath) {
      formData.append('BonCpdfPath', nouvelleCommande.BonCpdfPath);
    }
    if (nouvelleCommande.BonLpdfPath) {
      formData.append('BonLpdfPath', nouvelleCommande.BonLpdfPath);
    }
    formData.append('dte', nouvelleCommande.dte);
    formData.append('numL', nouvelleCommande.numL);

    try {
      const response = await axios.post('http://localhost:8787/api/bonc/upload', formData, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        }
      });
      setCommandes(prev => [...prev, response.data]);
      setNouvelleCommande({
        idbc: 0,
        numL: "",
        dte: "",
        BonCpdfPath: null,
        BonLpdfPath: null,
      });
      setFormVisible(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : 'Erreur lors de l\'ajout de la commande';
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage('Une erreur inattendue est survenue');
      }
      console.error('Erreur lors de l\'ajout de la commande !', error);
    }
  };

  const handleSupprimerCommande = async (idbc: number) => {
    try {
      await axios.delete(`http://localhost:8787/api/bonc/${idbc}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        }
      });
      setCommandes(prev => prev.filter(commande => commande.idbc !== idbc));
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande !', error);
    }
  };

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/bonc/all', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          }
        });
        setCommandes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes !', error);
      }
    };

    fetchCommandes();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const handleAfficherBonCommande = (commande: Commande) => {
    if (commande.BonCpdfPath) {
      window.open(commande.BonCpdfPath, '_blank');
    }
  };

  const handleAfficherBonLivraison = (commande: Commande) => {
    if (commande.BonLpdfPath) {
      window.open(commande.BonLpdfPath, '_blank');
    }
  };

  const handleModifierCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandeEnModification) return;

    const formData = new FormData();
    if (commandeEnModification.BonCpdfPath) {
      formData.append('BonCpdfPath', commandeEnModification.BonCpdfPath);
    }
    if (commandeEnModification.BonLpdfPath) {
      formData.append('BonLpdfPath', commandeEnModification.BonLpdfPath);
    }
    formData.append('numL', commandeEnModification.numL || "");
    formData.append('dte', commandeEnModification.dte || "");

    try {
      await axios.put(`http://localhost:8787/api/bonc/${commandeEnModification.idbc}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${keycloak.token}`,
        }
      });
      setCommandes(prev => prev.map(c => (c.idbc === commandeEnModification.idbc ? { ...commandeEnModification } : c)));
      setCommandeEnModification(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la commande !', error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setFormVisible(!formVisible)}
        className="bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-600 transition"
      >
        {formVisible ? 'Annuler' : 'Ajouter Commande'}
      </button>

      {formVisible && (
        <form onSubmit={handleAjouterCommande} className="mt-4">
          <div className="mb-4">
            <label htmlFor="numL" className="block text-sm font-medium text-gray-700">Numéro de Commande</label>
            <input
              type="text"
              id="numL"
              name="numL"
              value={nouvelleCommande.numL}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.numL && <p className="text-red-500 text-sm">{errors.numL}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="dte" className="block text-sm font-medium text-gray-700">Date de Commande</label>
            <input
              type="date"
              id="dte"
              name="dte"
              value={nouvelleCommande.dte}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.dte && <p className="text-red-500 text-sm">{errors.dte}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="BonCpdfPath" className="block text-sm font-medium text-gray-700">Bon de Commande PDF</label>
            <input
              type="file"
              id="BonCpdfPath"
              name="BonCpdfPath"
              accept=".pdf"
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.BonCpdfPath && <p className="text-red-500 text-sm">{errors.BonCpdfPath}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="BonLpdfPath" className="block text-sm font-medium text-gray-700">Bon de Livraison PDF</label>
            <input
              type="file"
              id="BonLpdfPath"
              name="BonLpdfPath"
              accept=".pdf"
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.BonLpdfPath && <p className="text-red-500 text-sm">{errors.BonLpdfPath}</p>}
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded shadow-lg hover:bg-green-600 transition"
          >
            Ajouter
          </button>
        </form>
      )}

      {commandeEnModification && (
        <form onSubmit={handleModifierCommande} className="mt-4">
          <div className="mb-4">
            <label htmlFor="numL" className="block text-sm font-medium text-gray-700">Numéro de Commande</label>
            <input
              type="text"
              id="numL"
              name="numL"
              value={commandeEnModification.numL}
              onChange={handleModifierChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dte" className="block text-sm font-medium text-gray-700">Date de Commande</label>
            <input
              type="date"
              id="dte"
              name="dte"
              value={commandeEnModification.dte}
              onChange={handleModifierChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="BonCpdfPath" className="block text-sm font-medium text-gray-700">Bon de Commande PDF</label>
            <input
              type="file"
              id="BonCpdfPath"
              name="BonCpdfPath"
              accept=".pdf"
              onChange={handleModifierChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="BonLpdfPath" className="block text-sm font-medium text-gray-700">Bon de Livraison PDF</label>
            <input
              type="file"
              id="BonLpdfPath"
              name="BonLpdfPath"
              accept=".pdf"
              onChange={handleModifierChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white p-2 rounded shadow-lg hover:bg-yellow-600 transition"
          >
            Modifier
          </button>
        </form>
      )}

      <table className="mt-4 w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Numéro de Commande</th>
            <th className="border px-4 py-2">Date de Commande</th>
            <th className="border px-4 py-2">Bon de Commande</th>
            <th className="border px-4 py-2">Bon de Livraison</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(commande => (
            <tr key={commande.idbc}>
              <td className="border px-4 py-2">{commande.numL}</td>
              <td className="border px-4 py-2">{formatDate(commande.dte)}</td>
              <td className="border px-4 py-2">
                {commande.BonCpdfPath && (
                  <button onClick={() => handleAfficherBonCommande(commande)} className="text-blue-500 underline">
                    Voir PDF
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">
                {commande.BonLpdfPath && (
                  <button onClick={() => handleAfficherBonLivraison(commande)} className="text-blue-500 underline">
                    Voir PDF
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => setCommandeEnModification(commande)} className="text-yellow-500">
                  <MdModeEdit />
                </button>
                <button onClick={() => handleSupprimerCommande(commande.idbc)} className="text-red-500 ml-2">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Commandes;
