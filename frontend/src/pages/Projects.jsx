// src/pages/Projects.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import AuthContext from "../context/AuthContext.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load projects");
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <ProjectCard key={proj._id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
}
