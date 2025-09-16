import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LogOut,
  LogIn,
  User,
  UserPlus,
  BookOpen,
  FolderOpen,
} from "lucide-react";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-200 shadow">
      <div className="container mx-auto flex justify-between">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          CampusCollab
        </Link>
        <div className="flex gap-2">
          <Link className="btn btn-ghost" to="/resources">
            <BookOpen className="w-4 h-4 mr-1" /> Resources
          </Link>
          <Link className="btn btn-ghost" to="/projects">
            <FolderOpen className="w-4 h-4 mr-1" /> Projects
          </Link>
          {user ? (
            <>
              <Link className="btn btn-ghost" to="/profile">
                <User className="w-4 h-4 mr-1" /> {user.name}
              </Link>
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                <LogIn className="w-4 h-4 mr-1" /> Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                <UserPlus className="w-4 h-4 mr-1" /> Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
