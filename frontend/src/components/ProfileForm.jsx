// src/components/ProfileForm.jsx
import { useState } from "react";
import axios from "axios";

export default function ProfileForm({ user, token }) {
  const [name, setName] = useState(user?.name || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { name, skills: skills.split(",").map((s) => s.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Skills (comma separated)"
        className="input input-bordered w-full mb-4"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <button className="btn btn-primary w-full">Save Changes</button>
    </form>
  );
}
