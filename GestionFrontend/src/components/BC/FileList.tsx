import React, { useEffect, useState } from 'react';
import axios from 'axios';




interface BonC {
    id: number;
    dte: string;  // or Date if you parse it
    numL: string;
    bonCpdfPath: string;
    bonLpdfPath: string;
}





const CommandeList: React.FC = () => {
    const [commandes, setCommandes] = useState<BonC[]>([]);

    useEffect(() => {
        axios.get<BonC[]>('http://localhost:8080/api/bonc/all')
            .then(response => {
                setCommandes(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the commandes!', error);
            });
    }, []);

    const viewPdf = (pdfPath: string) => {
        window.open(`http://localhost:8080/${pdfPath}`);
    };

    return (
        <div>
            <h1>Commandes List</h1>
            <ul>
                {commandes.map((commande) => (
                    <li key={commande.id}>
                        <div>
                            <p>Date: {new Date(commande.dte).toLocaleDateString()}</p>
                            <p>NumL: {commande.numL}</p>
                            <button onClick={() => viewPdf(commande.bonCpdfPath)}>View BonCommande</button>
                            <button onClick={() => viewPdf(commande.bonLpdfPath)}>View BonLivraison</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommandeList;
