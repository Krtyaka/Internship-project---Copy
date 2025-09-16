import Resource from "../models/resource.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Helper: upload a Buffer to Cloudinary using upload_stream
 * returns the Cloudinary result object (contains secure_url, public_id, etc.)
 */
const uploadBufferToCloudinary = (buffer, folder = "campus_resources") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Create resource (accepts either file upload as multipart/form-data 'file' OR a fileUrl in JSON)
export const createResource = async (req, res) => {
  try {
    const { title, description, category, fileUrl } = req.body;

    let file_data = {};
    if (req.file && req.file.buffer) {
      // Upload buffer to Cloudinary
      const result = await uploadBufferToCloudinary(req.file.buffer);
      file_data.fileUrl = result.secure_url;
      file_data.filePublicId = result.public_id;
    } else if (fileUrl) {
      // user provided an external URL instead of upload
      file_data.fileUrl = fileUrl;
    }

    const resource = new Resource({
      title,
      description,
      category,
      ...file_data,
      uploadedBy: req.user ? req.user._id : undefined,
    });

    await resource.save();
    return res.status(201).json(resource);
  } catch (error) {
    console.error("Resource create error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create resource", error: error.message });
  }
};

// Get all resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate(
      "uploadedBy",
      "name email"
    );
    res.json(resources);
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ message: "Failed to get resources" });
  }
};

// Delete a resource (also deletes from Cloudinary if filePublicId exists)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    // authorization check
    if (
      !req.user ||
      resource.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resource" });
    }

    // delete from Cloudinary if needed
    if (resource.filePublicId) {
      try {
        await cloudinary.uploader.destroy(resource.filePublicId);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
        // continue to delete DB record anyway
      }
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ message: "Failed to delete resource" });
  }
};
