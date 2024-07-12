// src/components/Home.tsx
import React from "react";
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
import Users from "@/components/Users";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

const Home: React.FC = () => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const logout = () => {
    keycloak.logout();
  };

  const getLinkClasses = (path: string) => {
    return location.pathname === path
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
          <img className="h-14 mt-10 m-4" src={CIH} alt="" />
          <div className="font-mono flex flex-col gap-12 text-xl font-bold mt-32 ml-12 mr-12">
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
        <div className="flex-1">
          <div className="Navbar h-32 flex flex-row items-center justify-between px-10 ">
            <h1 className="text-3xl font-bold">{getTitle()}</h1>
            <div className="flex flex-row items-center gap-6">
              <CiSearch className="cursor-pointer text-2xl " />
              <FaRegBell className="cursor-pointer text-2xl" />
              <Avatar className="cursor-pointer">
                <AvatarImage src={av} alt="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/assignment" element={<Assignment />} />
              {isAdmin && <Route path="/users" element={<Users />} />}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
