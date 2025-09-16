// src/pages/Dashboard.jsx
import { useContext } from "react";
import AuthContext from "../context/AuthContext.js";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <h1 className="text-3xl font-bold mb-4">Hello, {user.name}!</h1>
      <p>
        Welcome to your dashboard. You can now manage resources and projects.
      </p>
    </div>
  );
}
