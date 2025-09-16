// src/pages/ProjectDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProject(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
      }
    };
    fetchProject();
  }, [id, token]);

  const handleApply = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  if (!project) return <p className="p-6">Loading...</p>;
  const isMember = project.members.some((m) => m._id === user._id);
  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-500 mb-2">
        Skills Required: {project.skillsRequired.join(", ")}
      </p>
      <p className="mb-4">{project.description}</p>
      <h2 className="text-xl font-bold mb-2">Members:</h2>
      {project.members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <ul className="list-disc pl-6">
          {project.members.map((member, index) => (
            <li key={index}>{member.name || member.email}</li>
          ))}
        </ul>
      )}

      {!isMember && (
        <button className="btn btn-primary mt-4" onClick={handleApply}>
          Apply to Join
        </button>
      )}
    </div>
  );
}
