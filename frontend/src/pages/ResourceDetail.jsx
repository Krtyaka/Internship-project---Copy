// src/pages/ResourceDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resources/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResource(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load resource");
      }
    };
    fetchResource();
  }, [id, token]);

  if (!resource) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
      <p className="text-gray-500 mb-2">Category: {resource.category}</p>
      <p className="mb-4">{resource.description}</p>
      <a
        href={resource.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        Download
      </a>
    </div>
  );
}
