// src/pages/Resources.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ResourceCard from "../components/ResourceCard.jsx";
import AuthContext from "../context/AuthContext.js";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load resources");
      }
    };
    fetchResources();
  }, [token]);

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-2xl font-bold mb-4">All Resources</h1>
      {resources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <ResourceCard key={res._id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}
