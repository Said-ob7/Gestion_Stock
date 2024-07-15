// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";
import { FaComputer } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import av from "@/assets/avatar.png";
import CIH from "@/assets/CIH.svg";
import Dashboard from "@/components/Dashboard";
import Products from "@/components/Produits";
import Orders from "@/components/Commandes";
import Assignment from "@/components/Affectation";
import Settings from "@/components/Settings";
import Users from "@/components/Users/Users";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (keycloak.tokenParsed) {
      const { name, preferred_username, given_name, family_name, email } =
        keycloak.tokenParsed;

      setUsername(preferred_username);

      // Store user information in local storage
      localStorage.setItem("name", name || "");
      localStorage.setItem("preferred_username", preferred_username || "");
      localStorage.setItem("given_name", given_name || "");
      localStorage.setItem("family_name", family_name || "");
      localStorage.setItem("email", email || "");
    }
  }, [keycloak.tokenParsed]);

  const logout = () => {
    keycloak.logout();
    localStorage.clear(); // Clear local storage on logout
  };

  const getLinkClasses = (path: string) => {
    return location.pathname.startsWith(path)
      ? "flex flex-row items-center gap-4 cursor-pointer text-blue-500"
      : "flex flex-row items-center gap-4 cursor-pointer";
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/products":
        return "Produits";
      case "/orders":
        return "Commandes";
      case "/assignment":
        return "Affectation";
      case "/settings":
        return "Settings";
      case "/users":
      case "/users/new":
      case `/users/${location.pathname.split("/")[2]}`:
        return "Users";
      default:
        return "Dashboard";
    }
  };

  const hasResourceRole = (role: string, resource: string) => {
    const resourceAccess = keycloak.tokenParsed?.resource_access;
    return (
      resourceAccess &&
      resourceAccess[resource] &&
      resourceAccess[resource].roles.includes(role)
    );
  };

  const isAdmin = hasResourceRole("client_admin", "gestion-rest-api");

  return (
    <>
      <div className="flex flex-row">
        <div
          style={{ backgroundColor: "#F9F9F9" }}
          className="min-w-[200px] w-1/6 h-full h-screen flex flex-col"
        >
          <Link className="mt-10 m-4 flex justify-center" to={"/"}>
            <img className="h-14 " src={CIH} alt="" />
          </Link>
          <div className="font-mono flex flex-col gap-12 text-xl font-bold mt-20 ml-12 mr-12">
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              <RxDashboard /> Dashboard
            </Link>
            <Link to="/products" className={getLinkClasses("/products")}>
              <FaComputer /> Produits
            </Link>
            <Link to="/orders" className={getLinkClasses("/orders")}>
              <IoDocumentTextSharp /> Commandes
            </Link>
            <Link to="/assignment" className={getLinkClasses("/assignment")}>
              <FaPersonCirclePlus /> Affectation
            </Link>
            {isAdmin && (
              <Link to="/users" className={getLinkClasses("/users")}>
                <FaRegUser /> Users
              </Link>
            )}
            <hr className="border-t-2 border-gray-300" />
            <Link to="/settings" className={getLinkClasses("/settings")}>
              <IoSettingsOutline /> Settings
            </Link>
            <Button variant={"outline"} onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="flex-1 font-mono">
          <div className="Navbar h-32 flex flex-row items-center justify-between px-10 ">
            <h1 className="text-3xl font-bold">{getTitle()}</h1>
            <div className="flex flex-row items-center gap-6">
              {/* <CiSearch className="cursor-pointer text-2xl " /> */}
              <FaRegBell className="cursor-pointer text-2xl" />
              <p className="uppercase ">{username}</p>
              <Avatar className="cursor-pointer">
                <AvatarImage src={av} alt="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div
            className="mx-8 font-mono"
            // style={{ backgroundColor: "#f8f9fa" }}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/assignment" element={<Assignment />} />
              {isAdmin && <Route path="/users/*" element={<Users />} />}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
