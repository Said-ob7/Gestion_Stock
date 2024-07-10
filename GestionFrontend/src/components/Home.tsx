// src/components/Home.tsx
import React, { useState, useEffect } from "react";
import axios from "../api";

const Home: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return <div>{message}</div>;
};

export default Home;
