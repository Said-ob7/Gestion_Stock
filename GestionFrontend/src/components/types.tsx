import React, { useEffect, useState } from "react";
import axios from "@/Api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaTrash } from "react-icons/fa6";
import Modal from "@/components/Modal"; // Import the Modal component

interface Type {
  id: number;
  name: string;
}

const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [newType, setNewType] = useState("");
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message
  const [confirmDelete, setConfirmDelete] = useState<null | number>(null); // State to store the ID of the type to be deleted

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = () => {
    axios
      .get("/Prod/types")
      .then((response) => {
        setTypes(response.data);
        setModalMessage(""); // Clear any previous error message
      })
      .catch((error) => {
        console.error("Error fetching types!", error);
        setModalMessage("Error fetching types. Please try again later.");
        setShowModal(true); // Show modal with error message
      });
  };

  const addType = () => {
    if (newType) {
      axios
        .post("/Prod/types", { name: newType })
        .then(() => {
          fetchTypes(); // Refresh the list of types
          setNewType(""); // Clear the input after successful addition
          setShowNewTypeInput(false); // Hide the input after adding a new type
        })
        .catch((error) => {
          console.error("Error adding type!", error);
          setModalMessage("Error adding type. Please try again later.");
          setShowModal(true); // Show modal with error message
        });
    }
  };

  const deleteType = () => {
    if (confirmDelete !== null) {
      axios
        .delete(`/Prod/types/${confirmDelete}`)
        .then(() => {
          fetchTypes(); // Refresh the list of types after deletion
          setShowModal(false); // Hide modal after deletion
        })
        .catch((error) => {
          setModalMessage(
            "Vous ne pouvez pas supprimer ce type car il est associé à des produits existants."
          );
          setShowModal(true); // Show modal with error message
        })
        .finally(() => setConfirmDelete(null)); // Clear the confirmDelete state
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDelete(id);
    setModalMessage("Are you sure you want to delete this type?");
    setShowModal(true); // Show modal to confirm deletion
  };

  const toggleNewTypeInput = () => {
    setShowNewTypeInput((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Product Types</h2>

      {/* Use the Modal component */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        onConfirm={confirmDelete !== null ? deleteType : undefined}
      />

      <div className="mt-4">
        {types.map((type) => (
          <div key={type.id} className="flex items-center mb-2">
            <Input
              type="text"
              value={type.name}
              readOnly
              className="w-[250px] bg-gray-100"
            />
            <Button
              variant="ghost"
              onClick={() => handleDeleteClick(type.id)}
              className="ml-2 text-red-500 hover:text-red-500"
            >
              <FaTrash />
            </Button>
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
