// src/components/Admin.tsx
import React, { useState, useEffect } from "react";
import axios from "../api";

const Admin: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/ADMIN")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return <div>{message}</div>;
};

export default Admin;
