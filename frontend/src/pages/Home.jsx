// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Campus Collaboration Hub
      </h1>
      <p className="mb-6">
        Share resources, collaborate on projects, and connect with peers!
      </p>
      <div className="space-x-4">
        <Link to="/signup" className="btn btn-primary">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
      </div>
    </div>
  );
}
