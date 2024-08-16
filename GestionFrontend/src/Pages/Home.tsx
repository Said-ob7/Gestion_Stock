import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { FaComputer } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdMergeType } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CIH from "@/assets/CIH.svg";
import Dashboard from "@/components/Dashboard";
import Products from "@/components/Products/Produits";
import Orders from "@/components/Commandes/Commandes";
import Assignment from "@/components/Affectation";
import Settings from "@/components/Settings";
import Users from "@/components/Users/Users";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@/components/ui/button";
import av from "@/assets/avatar.png";
import Types from "@/components/types";

const Home: React.FC = () => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const [username, setUsername] = useState("");
  const [matricule, setMatricule] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(av); // Default avatar
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    if (keycloak.tokenParsed) {
      const {
        name,
        preferred_username,
        given_name,
        family_name,
        email,
        profile,
        matricule,
      } = keycloak.tokenParsed;

      setMatricule(matricule);
      setUsername(preferred_username);
      setAvatarUrl(profile || av); // Set avatar URL

      // Store user information in local storage
      localStorage.setItem("name", name || "");
      localStorage.setItem("preferred_username", preferred_username || "");
      localStorage.setItem("given_name", given_name || "");
      localStorage.setItem("family_name", family_name || "");
      localStorage.setItem("email", email || "");
    }
  }, [keycloak.tokenParsed]);

  // useEffect(() => {
  //   if (keycloak.token) {
  //     const socket = io("http://localhost:8787/ws", {
  //       extraHeaders: {
  //         Authorization: `Bearer ${keycloak.token}`,
  //       },
  //     });

  //     socket.on("connect", () => {
  //       console.log("Connected to WebSocket server");
  //     });

  //     socket.on("products", (message) => {
  //       toast.info(message);
  //       setNotifications((prev) => prev + 1); // Increment notification count
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }
  // }, [keycloak.token]);

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
      case "/products/new":
        return "Produits";
      case "/orders":
      case "/orders/upload":
      case `/orders/${location.pathname.split("/")[2]}`:
        return "Commandes";
      case "/assignment":
        return "Affectation";
      case "/settings":
        return "Settings";
      case "/users":
      case "/users/new":
      case `/users/${location.pathname.split("/")[2]}`:
        return "Users";
      case "/types":
        return "Types";
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
      <div className="flex h-screen">
        <div
          style={{ backgroundColor: "#F9F9F9" }}
          className="w-64 flex-shrink-0 h-full flex flex-col"
        >
          <Link className="mt-10 m-4 flex justify-center" to={"/"}>
            <img className="h-14" src={CIH} alt="Logo" />
          </Link>
          <div className="font-mono flex flex-col gap-10 text-xl font-bold mt-20 ml-4 lg:ml-12 mr-4 lg:mr-12">
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
              <>
                <Link to="/types" className={getLinkClasses("/types")}>
                  <MdMergeType /> Types
                </Link>
                <Link to="/users" className={getLinkClasses("/users")}>
                  <FaRegUser /> Users
                </Link>
              </>
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
        <div className="flex-1 overflow-y-auto">
          <div className="Navbar h-24 lg:h-32 flex flex-col lg:flex-row items-center justify-between px-4 lg:px-10">
            <h1 className="text-2xl lg:text-3xl font-extrabold uppercase">
              {getTitle()}
            </h1>
            <div className="flex flex-row items-center gap-4 lg:gap-6 mt-4 lg:mt-0">
              <div className="relative">
                <FaRegBell className="cursor-pointer text-2xl" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <p className="uppercase font-bold">{matricule}</p>
              <Link to={"/settings"}>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={avatarUrl}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="uppercase">
                    {username}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
          <div className="mx-4 lg:mx-8 font-mono">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products/*" element={<Products />} />
              <Route path="/orders/*" element={<Orders />} />
              <Route path="/assignment" element={<Assignment />} />
              {isAdmin && (
                <>
                  <Route path="/users/*" element={<Users />} />
                  <Route path="/types" element={<Types />} />
                </>
              )}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
