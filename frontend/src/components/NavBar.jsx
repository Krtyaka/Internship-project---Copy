// src/components/Navbar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-base-200 p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Campus Hub
      </Link>
      <div className="space-x-4">
        <Link to="/resources" className="btn btn-ghost btn-sm">
          Resources
        </Link>
        <Link to="/projects" className="btn btn-ghost btn-sm">
          Projects
        </Link>

        {user && (
          <>
            <Link to="/create-resource" className="btn btn-outline btn-sm">
              Add Resource
            </Link>
            <Link to="/create-project" className="btn btn-outline btn-sm">
              Add Project
            </Link>
          </>
        )}

        {user ? (
          <>
            <Link to="/profile" className="btn btn-outline btn-sm">
              {user.name}
            </Link>
            <button className="btn btn-sm btn-primary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-sm btn-outline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
