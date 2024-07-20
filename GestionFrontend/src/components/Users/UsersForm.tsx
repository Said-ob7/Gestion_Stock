import React, { useState } from "react";
import { Input } from "../ui/input";
import { useKeycloak } from "@react-keycloak/web";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { IoIosArrowBack } from "react-icons/io";

const UserForm: React.FC = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    matricule: "",
    profile: "/src/assets/avatar.png", // Default profile picture URL
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = "http://localhost:8080/admin/realms/said/users";

    const userPayload = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      enabled: true,
      credentials: [
        {
          type: "password",
          value: formData.password,
          temporary: false,
        },
      ],
      attributes: {
        matricule: formData.matricule,
        profile: formData.profile,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        const text = await response.text();
        const newUser = text ? JSON.parse(text) : {};
        console.log("User created successfully:", newUser);
        alert("User created successfully!");
        setFormData({
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          matricule: "",
          profile: "/src/assets/avatar.png", // Reset profile to default URL
        });
        navigate("/users");
      } else if (response.status === 409) {
        alert("A user with this username or email already exists.");
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create user:", errorMessage);
        alert("Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  return (
    <>
      <div className="flex flex-row items-center gap-[4px] my-4">
        <Link to={"/users"}>
          <IoIosArrowBack />
        </Link>
        <Link to={"/users"}>Retour</Link>
      </div>
      <div className="w-[700px] mx-14">
        <h2 className="text-xl font-bold">Create User</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="matricule">
              Matricule :
            </label>
            <Input
              className="w-[500px] h-14 mx-4"
              type="text"
              name="matricule"
              id="matricule"
              value={formData.matricule}
              onChange={handleChange}
              required
            />
          </div> */}
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
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28" htmlFor="password">
              Password :
            </label>
            <Input
              className="w-[500px] h-14 mx-4"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end m-14 gap-8">
            <Button type="submit" className="w-32">
              Create User
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserForm;
