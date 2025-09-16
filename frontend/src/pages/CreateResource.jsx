import React, { useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function CreateResource() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      if (file) data.append("file", file);

      await api.post("/resources", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resource created!");
      navigate("/resources"); // redirect back to list page
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <PlusCircle className="w-7 h-7" /> Add Resource
      </h2>

      <form
        onSubmit={handleSubmit}
        className="card bg-base-200 p-6 shadow-lg space-y-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Uploading..." : "Create Resource"}
        </button>
      </form>
    </div>
  );
}
