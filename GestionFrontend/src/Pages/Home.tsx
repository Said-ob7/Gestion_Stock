// src/components/Home.tsx
import React, { useState, useEffect } from "react";
import axios from "../Api/api";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";

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

  return (
    <>
      <div className="flex flex-row ">
        <div
          style={{ backgroundColor: "#F9F9F9" }}
          className="min-w-[200px] w-1/6 h-screen"
        ></div>
        <div className="flex-1">
          <div className="h-14 flex flex-row items-center justify-between px-10">
            <h1 className="text-xl font-bold">Produits</h1>
            <div className="flex flex-row items-center gap-5">
              <CiSearch />
              <FaRegBell />
            </div>
          </div>
          <div>{message}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
