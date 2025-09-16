import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";

export default function ResourceCard({ resource }) {
  const { token } = useContext(AuthContext);
  const [likes, setLikes] = useState(resource.likes);

  const handleLike = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/resources/${resource._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(likes + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to like resource");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-bold">{resource.title}</h3>
      <p className="text-sm text-gray-500">{resource.category}</p>
      <p className="mt-2">{resource.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span>{likes} Likes</span>
        <div className="flex space-x-2">
          <Link
            to={`/resources/${resource._id}`}
            className="btn btn-sm btn-primary"
          >
            View
          </Link>
          <button className="btn btn-sm btn-secondary" onClick={handleLike}>
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
