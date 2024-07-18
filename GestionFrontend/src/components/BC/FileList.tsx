import { useEffect, useState } from 'react';
import axios from 'axios';

interface BonC {
    idbc: number;
    nomC: string;
    numL: string;
    pdfPath: string;
}

const FileList = () => {
    const [files, setFiles] = useState<BonC[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get<BonC[]>('http://localhost:8787/api/bonc/all');
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8787/api/bonc/${id}`);
            setFiles(files.filter((file) => file.idbc !== id));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <div>
            {files.map((file) => (
                <div key={file.idbc}>
                    <p className="font-extrabold text-2xl">{file.nomC} ({file.numL})</p>

                    <button onClick={() => handleDelete(file.idbc)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default FileList;
