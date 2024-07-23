
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
        <h2 className="font-bold text-2xl mb-4">Uploaded Files</h2>
        {files.map((file) => (
            <div key={file.idbc} className="mb-4">
                <p className="font-extrabold text-2xl">{file.nomC} ({file.numL})</p>
                <a href={file.pdfPath} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mr-4">View PDF</a>
                <button 
                    onClick={() => handleDelete(file.idbc)} 
                    className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                </button>
            </div>
        ))}
    </div>
);
};

export default FileList;
