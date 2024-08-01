import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegUser, FaPlus } from "react-icons/fa";
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
  const [clientId, setClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchClientId = async () => {
      const url = "http://localhost:8080/admin/realms/said/clients";

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
              client.clientId === "gestion-rest-api"
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
      const url = "http://localhost:8080/admin/realms/said/users";

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
      const realmRolesUrl = `http://localhost:8080/admin/realms/said/users/${userId}/role-mappings/realm`;
      const clientRolesUrl = `http://localhost:8080/admin/realms/said/users/${userId}/role-mappings/clients/${clientId}`;

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
      const userDetailsUrl = `http://localhost:8080/admin/realms/said/users/${user.id}`;
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

    const updateUserRolesAndDetails = async (users: User[]) => {
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const roles = await fetchUserRoles(user.id);
          const userDetails = await fetchUserDetails(user);
          return {
            ...user,
            roles,
            createdAt: userDetails.createdAt,
            matricule: userDetails.matricule,
          };
        })
      );

      setUsers(updatedUsers);
    };

    if (users.length > 0) {
      updateUserRolesAndDetails(users);
    }
  }, [users, keycloak.token, clientId]);

  const filteredUsers = users
    .filter((user) => user.id !== keycloak.subject) // Exclude connected user
    .filter((user) => {
      const matricule = String(user.matricule || "");
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matricule.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = filterDate
        ? new Date(user.createdAt || 0).toDateString() ===
          new Date(filterDate).toDateString()
        : true;
      const matchesRole =
        filterRole === "client_admin"
          ? user.roles?.includes(filterRole)
          : filterRole === "client_user"
          ? !user.roles?.includes("client_admin")
          : true;
      return matchesSearch && matchesDate && matchesRole;
    });

  const handleSearchClick = () => {
    setShowSearchModal(!showSearchModal);
  };

  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <CiSearch
              onClick={handleSearchClick}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              size={24}
            />
            <CiFilter
              onClick={handleFilterClick}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              size={24}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {showSearchModal && (
            <input
              type="text"
              placeholder="Search by name or matricule"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md mb-4 w-full"
            />
          )}

          {showFilterModal && (
            <div className="flex gap-4">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-4 w-full"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-4 w-full"
              >
                <option value="">All Roles</option>
                <option value="client_user">User</option>
                <option value="client_admin">Admin</option>
              </select>
            </div>
          )}
        </div>

        <ul className="grid grid-cols-1 gap-4 mt-8">
          {filteredUsers.map((user) => (
            <li key={user.id} className="bg-white shadow-md rounded-lg p-4">
              <Link to={`/users/${user.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {user.roles?.includes("client_admin") ? (
                      <RiAdminLine className="text-blue-600" size={28} />
                    ) : (
                      <FaRegUser className="text-gray-600" size={28} />
                    )}
                    <div className="ml-4">
                      <p className="font-bold text-lg">{user.matricule}</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm font-semibold">
                      {user.roles?.includes("client_admin") ? "Admin" : "User"}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="fixed bottom-14 right-14 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          to="/users/new"
        >
          <FaPlus size={20} />
        </Link>
      </div>
    </>
  );
};

export default UsersList;
