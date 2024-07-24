import { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Ensure this file exists and is correctly imported

const FileUpload = () => {
    const [bonCommande, setBonCommande] = useState<File | null>(null);
    const [bonLivraison, setBonLivraison] = useState<File | null>(null);
    const [dte, setDte] = useState<string>("");
    const [numL, setNumL] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!bonCommande || !bonLivraison) {
            setError('Both files must be selected');
            return;
        }

        const formData = new FormData();
        formData.append('bonCommande', bonCommande);
        formData.append('bonLivraison', bonLivraison);
        formData.append('dte', dte);
        formData.append('numL', numL);

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8787/api/bonc/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            setError('Error uploading files');
            console.error('Error uploading files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <div className="form-group">
                <label htmlFor="dte">Date de la commande :</label>
                <input
                    id="dte"
                    type="date"
                    value={dte}
                    onChange={(e) => setDte(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="numL">Numéro série :</label>
                <input
                    id="numL"
                    type="text"
                    value={numL}
                    onChange={(e) => setNumL(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="bonCommande">Bon de commande (PDF) :</label>
                <input id="bonCommande" type="file" onChange={(e) => handleFileChange(e, setBonCommande)} />
            </div>
            <div className="form-group">
                <label htmlFor="bonLivraison">Bon de livraison (PDF) :</label>
                <input id="bonLivraison" type="file" onChange={(e) => handleFileChange(e, setBonLivraison)} />
            </div>
            <button className="upload-file" onClick={handleUpload} disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default FileUpload;
