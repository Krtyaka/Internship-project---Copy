import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import CreateResource from "./pages/CreateResource";
import CreateProject from "./pages/CreateProject";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public resource list */}
          <Route path="/resources" element={<Resources />} />

          {/* Protected create resource page */}
          <Route
            path="/resources/create"
            element={
              <ProtectedRoute>
                <CreateResource />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route path="/projects/:id" element={<Projects />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
