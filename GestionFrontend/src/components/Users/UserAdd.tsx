import React, { useState } from "react";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { IoIosArrowBack } from "react-icons/io";
import axios from "@/Api/api"; // Using the axios instance with baseURL

const UserAdd: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    matricule: "",
    email: "",
    firstName: "",
    lastName: "",
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

    const userPayload = {
      matricule: formData.matricule,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    try {
      const response = await axios.post("/User/add", userPayload);

      if (response.status === 201) {
        console.log("User created successfully:", response.data);
        alert("User created successfully!");
        setFormData({
          matricule: "",
          email: "",
          firstName: "",
          lastName: "",
        });
        navigate("/users");
      } else {
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
          <div className="mt-4 flex flex-row items-center">
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
            <Button type="submit" className="w-32">
              Create User
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserAdd;
