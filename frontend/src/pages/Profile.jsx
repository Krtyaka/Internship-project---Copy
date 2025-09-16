import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Edit, Check, X } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, login } = useContext(AuthContext);

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    skills: user?.skills ? user.skills.join(", ") : "",
    role: user?.role || "student",
  });

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      skills: user.skills ? user.skills.join(", ") : "",
      role: user.role || "student",
    });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", form);
      const token = localStorage.getItem("token");
      login(token, res.data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card bg-base-100 shadow-xl p-6">
      <div className="flex flex-col items-center">
        <div className="avatar placeholder mb-4">
          <div className="bg-primary text-primary-content rounded-full w-24">
            <span className="text-3xl">{user.name?.charAt(0) || <User />}</span>
          </div>
        </div>

        {/* Show edit button OR name/role based on mode */}
        {!isEditing ? (
          <>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-70 capitalize">{user.role}</p>
            <button onClick={handleEdit} className="btn btn-ghost btn-sm mt-2">
              <Edit className="w-4 h-4 mr-1" /> Edit Profile
            </button>
          </>
        ) : (
          <p className="text-lg font-semibold mb-4">Edit Profile</p>
        )}
      </div>

      <div className="divider"></div>

      {/* YOUR ORIGINAL VIEW MODE or EDIT MODE */}
      {isEditing ? (
        // EDIT MODE
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Skills (comma-separated)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn btn-success flex-1"
              disabled={loading}
            >
              <Check className="w-4 h-4 mr-1" />
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} className="btn btn-ghost flex-1">
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        // VIEW MODE - YOUR ORIGINAL CODE
        <div className="space-y-2">
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-bold">Contributions:</span>{" "}
            {user.contributions || 0}
          </p>

          {user.skills && user.skills.length > 0 && (
            <div>
              <span className="font-bold">Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.skills.map((skill, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
