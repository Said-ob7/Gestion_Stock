// src/components/Users.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import UsersList from "./UsersList";
import UserForm from "./UsersForm";
import UserDetails from "./UserDetails";

const Users: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersList />} />
      <Route path="/new" element={<UserForm />} />
      <Route path="/:userId" element={<UserDetails />} />
    </Routes>
  );
};

export default Users;
