// src/pages/CreateProject.jsx
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";

export default function CreateProject() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        {
          title,
          description,
          skillsRequired: skills.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project created successfully!");
      setTitle("");
      setDescription("");
      setSkills("");
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-200 flex justify-center">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        <input
          type="text"
          placeholder="Project Title"
          className="input input-bordered w-full mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Skills required (comma separated)"
          className="input input-bordered w-full mb-4"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full">Create Project</button>
      </form>
    </div>
  );
}
