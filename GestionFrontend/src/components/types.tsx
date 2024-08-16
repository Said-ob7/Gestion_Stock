import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaTrash } from "react-icons/fa6";

interface Type {
  id: number;
  name: string;
}

const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [newType, setNewType] = useState("");
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = () => {
    axios
      .get("/Prod/types")
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching types!", error);
      });
  };

  const addType = () => {
    if (newType) {
      axios
        .post("/Prod/types", { name: newType })
        .then((response) => {
          setTypes((prevTypes) => [...prevTypes, response.data]);
          setNewType(""); // Clear the input after successful addition
          setShowNewTypeInput(false); // Hide the input after adding a new type
        })
        .catch((error) => {
          console.error("Error adding type!", error);
        });
    }
  };

  const deleteType = (id: number) => {
    axios
      .delete(`/Prod/types/${id}`)
      .then(() => {
        setTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting type!", error);
      });
  };

  const toggleNewTypeInput = () => {
    setShowNewTypeInput((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Product Types</h2>
      <div className="mt-4">
        {types.map((type) => (
          <div key={type.id} className="flex items-center mb-2">
            <Input
              type="text"
              value={type.name}
              readOnly
              className="w-[250px] bg-gray-100 "
            />
            {/* <Button
              variant="ghost"
              onClick={() => deleteType(type.id)}
              className="ml-2 text-red-500 hover:text-red-500"
            >
              <FaTrash />
            </Button> */}
          </div>
        ))}
        {!showNewTypeInput ? (
          <Button
            variant={"ghost"}
            onClick={toggleNewTypeInput}
            className="mt-2"
          >
            <FaPlus />
          </Button>
        ) : (
          <div className="flex items-center mt-2">
            <Input
              className="w-[250px]"
              type="text"
              placeholder="New Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <Button onClick={addType} className="ml-2">
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Types;
