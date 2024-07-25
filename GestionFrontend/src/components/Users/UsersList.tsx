import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegUser, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { CiSearch, CiFilter } from "react-icons/ci";

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  matricule?: string;
  roles?: string[];
}

const UsersList: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [users, setUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [clientAdmins, setClientAdmins] = useState<User[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchClientId = async () => {
      const url = "http://localhost:8080/admin/realms/Gestion_Stock/clients"; // Replace with your Keycloak URL

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const clients = await response.json();
          const client = clients.find(
            (client: { clientId: string }) =>
              client.clientId === "S256"
          );
          if (client) {
            setClientId(client.id);
          } else {
            console.error("Client not found.");
          }
        } else {
          console.error("Failed to fetch clients.");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClientId();
  }, [keycloak.token]);

  useEffect(() => {
    const fetchUsers = async () => {
      const url = "http://localhost:8080/admin/realms/Gestion_Stock/users"; // Replace with your Keycloak URL

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [keycloak.token]);

  useEffect(() => {
    if (!clientId) return;

    const fetchUserRoles = async (userId: string): Promise<string[]> => {
      const realmRolesUrl = `http://localhost:8080/admin/realms/Gestion_Stock/users/${userId}/role-mappings/realm`; // Replace with your Keycloak URL
      const clientRolesUrl = `http://localhost:8080/admin/realms/Gestion_Stock/users/${userId}/role-mappings/clients/${clientId}`; // Replace with your Keycloak URL

      try {
        const [realmRolesResponse, clientRolesResponse] = await Promise.all([
          fetch(realmRolesUrl, {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }),
          fetch(clientRolesUrl, {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }),
        ]);

        const realmRoles = realmRolesResponse.ok
          ? await realmRolesResponse.json()
          : [];
        const clientRoles = clientRolesResponse.ok
          ? await clientRolesResponse.json()
          : [];

        const roles = [
          ...realmRoles.map((role: { name: string }) => role.name),
          ...clientRoles.map((role: { name: string }) => role.name),
        ];

        return roles;
      } catch (error) {
        console.error(`Error fetching roles for user ${userId}:`, error);
        return [];
      }
    };

    const fetchUserDetails = async (user: User) => {
      const userDetailsUrl = `http://localhost:8080/admin/realms/said/users/${user.id}`; // Replace with your Keycloak URL
      try {
        const response = await fetch(userDetailsUrl, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const userDetails = await response.json();
          return {
            ...user,
            createdAt: userDetails.createdTimestamp,
            matricule: userDetails.attributes?.matricule || "",
          };
        } else {
          console.error(`Failed to fetch details for user ${user.id}`);
          return user;
        }
      } catch (error) {
        console.error(`Error fetching details for user ${user.id}:`, error);
        return user;
      }
    };

    const categorizeUsers = async (users: User[]) => {
      const clientUsers: User[] = [];
      const clientAdmins: User[] = [];
      const currentUserId = keycloak.subject; // ID of the currently authenticated user

      for (const user of users) {
        if (user.id === currentUserId) continue; // Exclude the currently authenticated user

        const roles = await fetchUserRoles(user.id);
        const userDetails = await fetchUserDetails(user);
        user.roles = roles;
        user.createdAt = userDetails.createdAt;
        user.matricule = userDetails.matricule;

        if (roles.includes("client_admin")) {
          clientAdmins.push(user);
        } else {
          clientUsers.push(user);
        }
      }

      setClientUsers(clientUsers);
      setClientAdmins(clientAdmins);
    };

    if (users.length > 0) {
      categorizeUsers(users);
    }
  }, [users, keycloak.token, clientId]);

  const filteredUsers = clientUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricule?.includes(searchTerm.toLowerCase());
    const matchesDate = filterDate
      ? new Date(user.createdAt || 0).toDateString() ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSearch && matchesDate;
  });

  const filteredAdmins = clientAdmins.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricule?.includes(searchTerm.toLowerCase());
    const matchesDate = filterDate
      ? new Date(user.createdAt || 0).toDateString() ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSearch && matchesDate;
  });

  const handleSearchClick = () => {
    if (showSearchModal) {
      setShowSearchModal(false);
    } else {
      setShowSearchModal(true);
    }
  };

  const handleFilterClick = () => {
    if (showFilterModal) {
      setShowFilterModal(false);
    } else {
      setShowFilterModal(true);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-mono font-bold text-xl">Utilisateurs :</h2>
          <div className="flex gap-4">
            <CiSearch
              onClick={handleSearchClick}
              className="cursor-pointer"
              size={24}
            />

            <CiFilter
              onClick={handleFilterClick}
              className="cursor-pointer"
              size={24}
            />
          </div>
        </div>
        <div className="flex flex-row items-center">
          {showSearchModal && (
            <div className="">
              <input
                type="text"
                placeholder="Search by name or matricule"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-4 w-full min-w-[400px]"
              />
            </div>
          )}
          {showFilterModal && (
            <div className="">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-4 w-full"
              />
            </div>
          )}
        </div>
        <ul className="flex flex-col gap-4 mx-4 my-8">
          {filteredUsers.map((user) => (
            <li key={user.id} className="w-[900px]">
              <Link to={`/users/${user.id}`}>
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="h-14   flex flex-row items-center gap-[200px] rounded-md shadow"
                >
                  <div className="name w-[150px]   font-bold flex flex-row items-center gap-4">
                    <FaRegUser className="ml-8 " />
                    <p className="font-sans uppercase ">{user.matricule}</p>
                  </div>
                  <p className="uppercase font-extrabold w-[50px]">
                    {user.username}
                  </p>
                  <p>{user.email}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="font-mono font-bold text-xl">Administrateurs :</h2>
        <ul className="flex flex-col gap-4 mx-4 my-8">
          {filteredAdmins.map((user) => (
            <li key={user.id} className="w-[900px]">
              <Link to={`/users/${user.id}`}>
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="h-14  flex flex-row items-center gap-[200px] rounded-md shadow"
                >
                  <div className="name w-[150px]   font-bold flex flex-row items-center gap-4">
                    <RiAdminLine className="ml-8 h-6 w-6" />
                    <p className="font-sans uppercase ">{user.matricule}</p>
                  </div>
                  <p className="uppercase font-extrabold w-[50px]">
                    {user.username}
                  </p>
                  <p>{user.email}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link className="fixed bottom-14 right-14" to="/users/new">
        <Button>
          <FaPlus />
        </Button>
      </Link>
    </>
  );
};

export default UsersList;
