import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoIosArrowBack } from "react-icons/io";

const UserDetails: React.FC = () => {
  const { keycloak } = useKeycloak();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    matricule: "",
  });

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

          const matricule = data.attributes?.matricule
            ? data.attributes.matricule[0]
            : "";
          setFormData({
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            matricule: matricule,
          });
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [keycloak.token, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = `http://localhost:8080/admin/realms/said/users/${userId}`; // Replace with your Keycloak URL

    const userPayload = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      attributes: {
        matricule: [formData.matricule],
      },
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        alert("User updated successfully!");
        setUser(userPayload);
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDeletion) {
      return;
    }

    const url = `http://localhost:8080/admin/realms/said/users/${userId}`; // Replace with your Keycloak URL

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (response.ok) {
        alert("User deleted successfully!");
        navigate("/users");
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-row items-center gap-[4px] my-4">
        <Link className="" to={"/users"}>
          <IoIosArrowBack />
        </Link>
        <Link className="" to={"/users"}>
          Retour
        </Link>
      </div>
      <div className="w-[700px] mx-14">
        <h2 className="text-xl font-bold">User Details :</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="matricule">
              Matricule :
            </label>
            <Input
              className="w-[500px] h-14 m-4"
              type="text"
              name="matricule"
              id="matricule"
              value={formData.matricule}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="username">
              Username :
            </label>
            <Input
              className="w-[500px] h-14 m-4"
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="email">
              Email :
            </label>
            <Input
              className="w-[500px] h-14 mx-4"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="firstName">
              First Name :
            </label>
            <Input
              className="w-[500px] h-14 mx-4"
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="lastName">
              Last Name :
            </label>
            <Input
              className="w-[500px] h-14 mx-4"
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end m-14 gap-8">
            <Button type="submit">Save</Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserDetails;
