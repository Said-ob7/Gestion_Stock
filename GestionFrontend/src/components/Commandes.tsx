import React, { useState } from 'react';
import FileUpload from '@/components/BC/FileUpload';
import FileList from '@/components/BC/FileList';
import FloatingButton from '@/components/BC/button';
import '@/components/BC/Commande.css'; // Assurez-vous d'importer le fichier CSS
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


function Commandes() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const toggleUploadForm = () => {
        setIsUploadOpen(!isUploadOpen);
    };

    return (
        <div className="commandes-container">
            <FileList />
            {isUploadOpen && (
                <div className="upload-form-overlay">
                    <div className="upload-form-container">
                        <FileUpload />
                        <button className="Fermer" onClick={toggleUploadForm}>Fermer</button>
                    </div>
                </div>
            )}
            <FloatingButton onClick={toggleUploadForm} />
        </div>
    );
}

export default Commandes;
