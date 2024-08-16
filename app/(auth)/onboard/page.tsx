"use client";

import { useUser } from "@stackframe/stack";
import type React from "react";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const Onboard: React.FC = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const user = useUser({ or: "redirect" });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim() === "" || nickname.trim() === "" || !selectedImage) {
      setError("All fields are required.");
      return;
    }

    setError("");

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('nickname', nickname);
      if (selectedImage) {
        formData.append('profilePicture', selectedImage);
      }

			const { accessToken, refreshToken } = await user.getAuthJson()
			if (!accessToken || !refreshToken)  return null
      const response = await fetch('http://localhost:8080/api/user', {
				headers: {
					'x-stack-access-token': accessToken,
					'x-stack-refresh-token': refreshToken,
				},
				method: 'PUT',
				body: formData
			});

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred while updating your information.");
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-96">
      <form id="updateUserForm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Update User Profile</h2>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default Onboard;