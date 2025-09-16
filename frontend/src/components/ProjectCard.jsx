// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-bold">{project.title}</h3>
      <p className="text-sm text-gray-500">
        Skills: {project.skillsRequired.join(", ")}
      </p>
      <p className="mt-2">{project.description}</p>
      <div className="mt-4 flex justify-end">
        <Link
          to={`/projects/${project._id}`}
          className="btn btn-sm btn-primary"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}
