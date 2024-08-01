import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { Input } from "./ui/input";

const Settings: React.FC = () => {
  const { keycloak } = useKeycloak();
  const user = keycloak?.tokenParsed;

  const [formData, setFormData] = useState({
    profile: user?.profile || "/src/assets/avatar.png",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(formData.profile);

  useEffect(() => {
    if (user) {
      setFormData({
        profile: user.profile || "/src/assets/avatar.png",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPreview(user.profile || "/src/assets/avatar.png");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile && user) {
      const fileData = new FormData();
      fileData.append("file", selectedFile);

      try {
        const response = await fetch(
          "http://localhost:8787/api/profile/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            body: fileData,
          }
        );

        if (response.ok) {
          const profileUrl = await response.text();
          const userId = user.sub;
          const userUrl = `http://localhost:8080/admin/realms/said/users/${userId}`;

          // Fetch existing user data
          const existingUserResponse = await fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${keycloak.token}`,
            },
          });

          if (existingUserResponse.ok) {
            const existingUserData = await existingUserResponse.json();

            const userPayload = {
              ...existingUserData,
              attributes: {
                ...existingUserData.attributes,
                profile: profileUrl,
              },
            };

            // Update user with new profile picture
            const updateResponse = await fetch(userUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
              },
              body: JSON.stringify(userPayload),
            });

            if (updateResponse.ok) {
              window.location.reload();
            } else {
              alert("Failed to update Keycloak profile.");
            }
          } else {
            alert("Failed to fetch existing user data.");
          }
        } else {
          alert("Failed to upload profile image.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.oldPassword &&
      formData.newPassword === formData.confirmPassword &&
      user
    ) {
      try {
        const passwordChangePayload = {
          type: "password",
          value: formData.newPassword,
          temporary: false,
        };

        const userId = user.sub;
        const passwordChangeUrl = `http://localhost:8080/admin/realms/said/users/${userId}/reset-password`;

        const passwordChangeResponse = await fetch(passwordChangeUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(passwordChangePayload),
        });

        if (passwordChangeResponse.ok) {
          alert("Password updated successfully!");
        } else {
          alert("Failed to update password.");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        alert("An error occurred while updating the password.");
      }
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <>
      <div className="flex flex-row items-center gap-[4px] my-4">
        <Link to={"/dashboard"}>
          <IoIosArrowBack />
        </Link>
        <Link to={"/dashboard"}>Retour</Link>
      </div>
      <div className="w-[700px] mx-14">
        <h2 className="text-xl font-bold">Settings</h2>
        <div className="flex justify-center mb-8 relative">
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-4 hover:border-blue-100 cursor-pointer relative"
            onClick={() => document.getElementById("profileInput")?.click()}
          >
            <img
              src={preview || formData.profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50">
              <FiCamera className="text-white text-2xl" />
            </div>
          </div>
        </div>
        <input
          type="file"
          id="profileInput"
          name="profile"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <form onSubmit={handleProfileSubmit}>
          <div className="flex justify-end m-14 gap-8">
            <Button type="submit" className="w-32">
              Save Profile
            </Button>
          </div>
        </form>
        <h2 className="text-xl font-bold mt-10">User Information</h2>
        <div className="mx-14">
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28 font-bold">Matricule:</label>
            <p className="w-[500px] h-14 mx-4 flex items-center">
              {user?.matricule}
            </p>
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28 font-bold">Username:</label>
            <p className="w-[500px] h-14 mx-4 flex items-center">
              {user?.preferred_username}
            </p>
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28 font-bold">Email:</label>
            <p className="w-[500px] h-14 mx-4 flex items-center">
              {user?.email}
            </p>
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28 font-bold">First Name:</label>
            <p className="w-[500px] h-14 mx-4 flex items-center">
              {user?.given_name}
            </p>
          </div>
          <div className="mt-4 flex flex-row items-center">
            <label className="w-28 font-bold">Last Name:</label>
            <p className="w-[500px] h-14 mx-4 flex items-center">
              {user?.family_name}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-10">Changer Mot de Passe</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mt-4 flex flex-row items-center">
            <Input
              className="w-[500px] h-14 mx-4"
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Ancien Mot de passe"
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <Input
              className="w-[500px] h-14 mx-4"
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Nouveau Mot de passe"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 flex flex-row items-center">
            <Input
              className="w-[500px] h-14 mx-4"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirmer Mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end m-14 gap-8">
            <Button type="submit" className="w-32">
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Settings;
