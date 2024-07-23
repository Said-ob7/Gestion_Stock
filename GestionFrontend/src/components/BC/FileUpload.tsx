
import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [nomC, setNomC] = useState<string>("");
    const [numL, setNumL] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('nomC', nomC);
        formData.append('numL', numL);

        try {
            const response = await axios.post('http://localhost:8787/api/bonc/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Num  Commande" value={nomC} onChange={(e) => setNomC(e.target.value)} />
            <input type="text" placeholder="Numero serie" value={numL} onChange={(e) => setNumL(e.target.value)} />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
