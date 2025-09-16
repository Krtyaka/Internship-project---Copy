// src/pages/CreateResource.jsx
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";

export default function CreateResource() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/resources", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Resource uploaded successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resource");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-200 flex justify-center">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="input input-bordered w-full mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          className="file-input file-input-bordered w-full mb-4"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button className="btn btn-primary w-full">Upload</button>
      </form>
    </div>
  );
}
