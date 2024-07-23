import React, { useState } from "react";
import { FaFilter } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Commande {
  id: number;
  numero: string;
  date: string;
  bonCommande?: File;
  bonLivraison?: File;
}

const Commandes = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [nouvelleCommande, setNouvelleCommande] = useState<Commande>({
    id: 0,
    numero: "",
    date: "",
    bonCommande: undefined,
    bonLivraison: undefined,
  });
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [nextId, setNextId] = useState<number>(1);
  const [filtrageActif, setFiltrageActif] = useState<boolean>(false);
  const [critereFiltrage, setCritereFiltrage] = useState<'numero' | 'date' | null>(null);
  const [valeurFiltre, setValeurFiltre] = useState<Date | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "valeurFiltre") {
      setValeurFiltre(value ? new Date(value) : null);
    } else if (name === "bonCommande" || name === "bonLivraison") {
      setNouvelleCommande(prev => ({
        ...prev,
        [name]: files?.[0],
      }));
    } else {
      setNouvelleCommande(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!nouvelleCommande.numero) newErrors.numero = "Le numéro de la commande est requis.";
    if (!nouvelleCommande.date) newErrors.date = "La date de la commande est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAjouterCommande = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const commandeAvecId = { ...nouvelleCommande, id: nextId };
      setCommandes(prev => [...prev, commandeAvecId]);
      setNouvelleCommande({ id: 0, numero: "", date: "", bonCommande: undefined, bonLivraison: undefined });
      setErrors({});
      setFormVisible(false);
      setNextId(nextId + 1);
    }
  };

  const handleSupprimerCommande = (id: number) => {
    setCommandes(prev => prev.filter(commande => commande.id !== id));
  };

  const handleAfficherPDF = (fichier?: File) => {
    if (fichier) {
      const url = URL.createObjectURL(fichier);
      window.open(url, '_blank');
    }
  };

  const filteredCommandes = commandes.filter(commande => {
    if (critereFiltrage === 'numero') {
      return commande.numero.includes(valeurFiltre ? valeurFiltre.toISOString().split('T')[0] : "");
    }
    if (critereFiltrage === 'date') {
      const selectedDate = valeurFiltre?.toISOString().split('T')[0] || "";
      const commandeDate = new Date(commande.date).toISOString().split('T')[0];
      return commandeDate === selectedDate;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Commandes</h1>

      <div className="relative mb-4 flex justify-end">
        <button
          onClick={() => setFiltrageActif(prev => !prev)}
          className="bg-gray-800 text-white p-2 rounded shadow-lg hover:bg-gray-900 transition"
        >
          <FaFilter />
        </button>

        {filtrageActif && (
          <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded shadow-lg p-4 z-10">
            <h2 className="text-xl font-semibold mb-2">Filtrer les Commandes</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Critère de filtrage :</label>
              <select
                value={critereFiltrage || ''}
                onChange={(e) => setCritereFiltrage(e.target.value as 'numero' | 'date')}
                className="border p-2 rounded w-full mt-1"
              >
                <option value="">Sélectionner un critère</option>
                <option value="numero">Numéro</option>
                <option value="date">Date</option>
              </select>
            </div>
            {critereFiltrage === 'date' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sélectionner une date :</label>
                <DatePicker
                  selected={valeurFiltre}
                  onChange={(date: Date | null) => setValeurFiltre(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded w-full mt-1"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setFormVisible(prev => !prev)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded shadow-lg hover:bg-blue-600 transition"
      >
        {formVisible ? "Fermer" : "+"}
      </button>

      {formVisible && (
        <form onSubmit={handleAjouterCommande} className="p-4 border border-gray-300 rounded shadow-lg mb-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Ajouter une Commande</h2>
          <div className="mb-4">
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Numéro de la commande :</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={nouvelleCommande.numero}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date de la commande :</label>
            <input
              type="date"
              id="date"
              name="date"
              value={nouvelleCommande.date}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="bonCommande" className="block text-sm font-medium text-gray-700">Importer un bon de commande (PDF) :</label>
            <input
              type="file"
              id="bonCommande"
              name="bonCommande"
              accept=".pdf"
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bonLivraison" className="block text-sm font-medium text-gray-700">Importer un bon de livraison (PDF) :</label>
            <input
              type="file"
              id="bonLivraison"
              name="bonLivraison"
              accept=".pdf"
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
          <button type="submit" className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">Ajouter</button>
        </form>
      )}

      {filteredCommandes.length > 0 ? (
        <ul>
          {filteredCommandes.map(commande => (
            <li
              key={commande.id}
              className="flex justify-between items-center p-2 border-b border-gray-200 cursor-pointer"
              onClick={() => handleAfficherPDF(commande.bonCommande)}
            >
              <span>{`Commande #${commande.numero} - Date: ${commande.date}`}</span>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAfficherPDF(commande.bonCommande);
                  }}
                  className="bg-orange-500 text-white p-1 rounded hover:bg-orange-600 transition mx-1"
                >
                  Bon de commande
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAfficherPDF(commande.bonLivraison);
                  }}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition mx-1"
                >
                  Bon de livraison
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSupprimerCommande(commande.id);
                  }}
                  className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 transition mx-1"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucune commande correspondant aux critères de filtrage.</p>
      )}
    </div>
  );
};

export default Commandes;
