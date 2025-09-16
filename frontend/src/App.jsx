import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.js";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Resources from "./pages/Resources.jsx";
import ResourceDetail from "./pages/ResourceDetail.jsx";
import CreateResource from "./pages/CreateResource.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import CreateProject from "./pages/CreateProject.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Resources Routes */}
          <Route
            path="/resources"
            element={user ? <Resources /> : <Navigate to="/login" />}
          />
          <Route
            path="/resources/:id"
            element={user ? <ResourceDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-resource"
            element={user ? <CreateResource /> : <Navigate to="/login" />}
          />

          {/* Projects Routes */}
          <Route
            path="/projects"
            element={user ? <Projects /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects/:id"
            element={user ? <ProjectDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-project"
            element={user ? <CreateProject /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}
