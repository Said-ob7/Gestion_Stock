import React from "react";
import UploadCommande from "./Commandes/UploadCommande";
import CommandeList from "./Commandes/CommandeList";

function Commandes() {
  return (
    <>
      <CommandeList />
      <UploadCommande />
    </>
  );
}

export default Commandes;
