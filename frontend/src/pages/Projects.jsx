import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Users, Trash2 } from "lucide-react";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!user) return toast.error("Login required");
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Filter projects to show only other users' projects in main section
  const otherUsersProjects = user
    ? projects.filter(
        (p) =>
          !p.createdBy ||
          (typeof p.createdBy === "object"
            ? p.createdBy._id !== user._id
            : p.createdBy !== user._id)
      )
    : projects;

  // Filter current user's projects for separate section
  const myProjects = user
    ? projects.filter((p) =>
        typeof p.createdBy === "object"
          ? p.createdBy._id === user._id
          : p.createdBy === user._id
      )
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Projects</h2>
        {user && (
          <Link to="/projects/create" className="btn btn-primary">
            <PlusCircle className="w-4 h-4 mr-1" /> New Project
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : otherUsersProjects.length === 0 && myProjects.length === 0 ? (
        <p className="text-center opacity-70">No projects yet</p>
      ) : (
        <div className="space-y-4">
          {otherUsersProjects.map((p) => (
            <div
              key={p._id}
              className="card bg-base-100 p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-sm">{p.description}</p>
                <p className="text-xs opacity-70">
                  Created by:{" "}
                  {typeof p.createdBy === "object"
                    ? p.createdBy.name
                    : "Unknown"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/projects/${p._id}`}
                  className="btn btn-outline btn-sm"
                >
                  <Users className="w-4 h-4" /> View
                </Link>
                {user &&
                  (p.createdBy._id === user._id ||
                    p.createdBy === user._id) && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {user && myProjects.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">My Projects</h3>
          <div className="space-y-4">
            {myProjects.map((p) => (
              <div
                key={p._id}
                className="card bg-base-100 p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h4 className="font-semibold">{p.title}</h4>
                  <p className="text-sm opacity-70">{p.description}</p>
                  <p className="text-xs opacity-50">
                    Created by:{" "}
                    {typeof p.createdBy === "object"
                      ? p.createdBy.name
                      : "Unknown"}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Link
                    to={`/projects/${p._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    <Users className="w-4 h-4" /> View
                  </Link>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
