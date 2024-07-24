import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../ui/button";
import { FaRegUser } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

const UsersList: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [users, setUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [clientAdmins, setClientAdmins] = useState<User[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

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
          //console.log("Fetched users:", data);
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

        // console.log(`Fetched roles for user ${userId}:`, roles);
        return roles;
      } catch (error) {
        console.error(`Error fetching roles for user ${userId}:`, error);
        return [];
      }
    };

    const categorizeUsers = async (users: User[]) => {
      const clientUsers: User[] = [];
      const clientAdmins: User[] = [];
      const currentUserId = keycloak.subject; // ID of the currently authenticated user

      for (const user of users) {
        if (user.id === currentUserId) continue; // Exclude the currently authenticated user

        const roles = await fetchUserRoles(user.id);
        user.roles = roles;
        // if (roles.includes("client_user")) {
        //   clientUsers.push(user);
        // }
        if (roles.includes("client_admin")) {
          clientAdmins.push(user);
        } else {
          clientUsers.push(user);
        }
      }

      //   console.log("Client Users:", clientUsers);
      //   console.log("Client Admins:", clientAdmins);
      setClientUsers(clientUsers);
      setClientAdmins(clientAdmins);
    };

    if (users.length > 0) {
      categorizeUsers(users);
    }
  }, [users, keycloak.token, clientId]);

  return (
    <>
      <div>
        <h2 className="font-mono font-bold text-xl">Utilisateurs :</h2>
        <ul className="flex flex-col gap-4 mx-4 my-8">
          {clientUsers.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="h-14 w-[800px]  flex flex-row items-center gap-[200px] rounded-md shadow"
                >
                  <div className="name w-[150px]   font-bold flex flex-row items-center gap-4">
                    <FaRegUser className="ml-8 " />
                    <p className="font-sans uppercase ">{user.username}</p>
                  </div>
                  <p>{user.email}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="font-mono font-bold text-xl">Administrateurs :</h2>
        <ul className="flex flex-col gap-4 mx-4 my-8">
          {clientAdmins.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="h-14 w-[800px]  flex flex-row items-center gap-[200px] rounded-md shadow"
                >
                  <div className="name w-[150px]   font-bold flex flex-row items-center gap-4">
                    <RiAdminLine className="ml-8 h-6 w-6" />
                    <p className="font-sans uppercase">{user.username}</p>
                  </div>
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
