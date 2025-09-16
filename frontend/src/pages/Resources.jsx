import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Trash2, ExternalLink, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Resources() {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resources");
      setResources(res.data);
    } catch (err) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (!user) return toast.error("Login required");
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      await api.delete(`/resources/${id}`);
      toast.success("Deleted successfully");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ✅ Filter current user's resources for separate section
  const myResources = user
    ? resources.filter(
        (r) =>
          r.uploadedBy &&
          (r.uploadedBy._id === user._id || r.uploadedBy === user._id)
      )
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Resources</h2>
        {user && (
          <Link to="/resources/create" className="btn btn-primary">
            <PlusCircle className="w-4 h-4 mr-1" /> New Resource
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-center opacity-70">No resources available</p>
      ) : (
        <div className="space-y-4">
          {resources.map((res) => (
            <div
              key={res._id}
              className="card bg-base-200 p-4 shadow flex flex-col sm:flex-row justify-between"
            >
              <div>
                <h3 className="text-lg font-bold">{res.title}</h3>
                <p className="text-sm">{res.description}</p>
                <p className="text-xs opacity-70">Category: {res.category}</p>
                {res.uploadedBy && (
                  <p className="text-xs opacity-70">
                    Uploaded by:{" "}
                    {typeof res.uploadedBy === "object"
                      ? res.uploadedBy.name
                      : "Unknown"}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> View
                  </a>
                )}

                {/* ✅ Compare either string or object._id */}
                {user &&
                  res.uploadedBy &&
                  (res.uploadedBy._id === user._id ||
                    res.uploadedBy === user._id) && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(res._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {user && myResources.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">My Resources</h3>
          <div className="space-y-3">
            {myResources.map((res) => (
              <div
                key={res._id}
                className="card bg-base-300 p-3 shadow flex justify-between"
              >
                <span>{res.title}</span>
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => handleDelete(res._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
