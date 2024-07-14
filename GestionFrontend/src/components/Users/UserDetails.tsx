// src/components/UserDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const UserDetails: React.FC = () => {
  const { keycloak } = useKeycloak();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const url = `http://localhost:8080/admin/realms/said/users/${userId}`; // Replace with your Keycloak URL

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [keycloak.token, userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserDetails;
