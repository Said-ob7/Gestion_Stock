import React from "react";
import UploadCommande from "./UploadCommande";
import CommandeList from "./CommandeList";
import { Route, Routes } from "react-router-dom";

function Commandes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CommandeList />} />
        <Route path="/upload" element={<UploadCommande />} />
      </Routes>
    </>
  );
}

export default Commandes;
