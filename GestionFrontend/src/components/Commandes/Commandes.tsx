import React from "react";
import UploadCommande from "./UploadCommande";
import CommandeList from "./CommandeList";
import { Route, Routes } from "react-router-dom";
import CommandeDetails from "./CommandeDetails";

function Commandes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CommandeList />} />
        <Route path="/upload" element={<UploadCommande />} />
        <Route path="/:id" element={<CommandeDetails />} />
      </Routes>
    </>
  );
}

export default Commandes;
