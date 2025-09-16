import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { PlusCircle, Users, Trash2 } from "lucide-react";

export default function Projects() {
  const { id } = useParams();
  const { user, updateContributions } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [singleProject, setSingleProject] = useState(null);
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

  const fetchSingleProject = async (projectId) => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);
      setSingleProject(res.data);
    } catch (err) {
      toast.error("Failed to load project");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // If there's an ID, fetch single project
      fetchSingleProject(id);
    } else {
      // If no ID, fetch all projects
      fetchProjects();
    }
  }, [id]); //id as dependency

  if (id) {
    if (loading) {
      return (
        <div className="flex justify-center p-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    if (!singleProject) {
      return (
        <div className="text-center mt-10">
          <p className="text-xl">Project not found</p>
          <Link to="/projects" className="btn btn-primary mt-4">
            Back to Projects
          </Link>
        </div>
      );
    }

    // Single project view
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Link to="/projects" className="btn btn-ghost mb-4">
          ← Back to Projects
        </Link>

        <div className="card bg-base-100 shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-4">{singleProject.title}</h1>
          <p className="mb-4 text-base-content/80">
            {singleProject.description}
          </p>

          {singleProject.skillsRequired &&
            singleProject.skillsRequired.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Skills Required:</h3>
                <div className="flex flex-wrap gap-2">
                  {singleProject.skillsRequired.map((skill, index) => (
                    <span key={index} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-4 pt-4 border-t">
            <p>
              <strong>Created by:</strong>{" "}
              {singleProject.createdBy?.name || "Unknown"}
            </p>
            <p>
              <strong>Members:</strong> {singleProject.members?.length || 0}
            </p>
            {singleProject.createdAt && (
              <p>
                <strong>Created:</strong>{" "}
                {new Date(singleProject.createdAt).toLocaleDateString()}
              </p>
            )}

            {/* Join button in single project view */}
            {user &&
              singleProject.createdBy &&
              singleProject.createdBy._id !== user._id &&
              !singleProject.members?.some(
                (member) => member._id === user._id
              ) && (
                <button
                  className="btn btn-success mt-4"
                  onClick={() => handleJoin(singleProject._id)}
                >
                  Join This Project
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!user) return toast.error("Login required");
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      updateContributions(-1);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleJoin = async (id) => {
    if (!user) return toast.error("Login required");

    try {
      await api.post(`/projects/${id}/join`);
      toast.success("Joined project successfully!");
      // Refresh projects to show updated member count
      fetchProjects();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to join project";
      toast.error(message);
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

                {p.skillsRequired && p.skillsRequired.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs opacity-70">Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-outline badge-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {p.skillsRequired.length > 3 && (
                        <span className="badge badge-ghost badge-xs">
                          +{p.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs opacity-70 mt-2">
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

                {/* Join button - only show if user is not the creator and not already a member */}
                {user &&
                  p.createdBy &&
                  (typeof p.createdBy === "object"
                    ? p.createdBy._id !== user._id
                    : p.createdBy !== user._id) &&
                  !p.members?.some((member) =>
                    typeof member === "object"
                      ? member._id === user._id
                      : member === user._id
                  ) && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleJoin(p._id)}
                    >
                      Join
                    </button>
                  )}

                {/* Delete button - only for project creator */}
                {user &&
                  p.createdBy &&
                  (typeof p.createdBy === "object"
                    ? p.createdBy._id === user._id
                    : p.createdBy === user._id) && (
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

                  {/* ADD SKILLS DISPLAY FOR MY PROJECTS */}
                  {p.skillsRequired && p.skillsRequired.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs opacity-70">Skills: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="badge badge-outline badge-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {p.skillsRequired.length > 3 && (
                          <span className="badge badge-ghost badge-xs">
                            +{p.skillsRequired.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-50 mt-2">
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
