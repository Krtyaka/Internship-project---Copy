import Resource from "../models/resource.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import User from "../models/User.js"; // make sure filename matches actual model

// Helper: Upload file buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder = "campus_resources") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        format: "pdf", // ✅ force Cloudinary to treat file as PDF if it's a PDF
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Create Resource
// ✅ Create Resource
export const createResource = async (req, res) => {
  try {
    const { title, description, category, fileUrl } = req.body;
    let fileData = {};

    // Handle file upload
    if (req.file && req.file.buffer) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      const result = await uploadBufferToCloudinary(req.file.buffer);

      // ✅ Log Cloudinary upload details (debugging)
      console.log("Cloudinary upload result:", {
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        url: result.secure_url,
      });

      // ✅ If file is a PDF, make it open inline in browser
      let finalUrl = result.secure_url;
      if (result.format === "pdf") {
        finalUrl = finalUrl.replace("/upload/", "/upload/fl_attachment:false/");
      }

      fileData.fileUrl = finalUrl;
      fileData.filePublicId = result.public_id;
    } else if (fileUrl) {
      fileData.fileUrl = fileUrl;
    }

    const resource = await Resource.create({
      title,
      description,
      category,
      ...fileData,
      uploadedBy: req.user ? req.user._id : undefined,
    });

    // ✅ Increment contributions
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { contributions: 1 },
      });
    }

    res.status(201).json(resource);
  } catch (error) {
    console.error("Resource create error:", error);
    res
      .status(500)
      .json({ message: "Failed to create resource", error: error.message });
  }
};

// Get All Resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate(
      "uploadedBy",
      "name email"
    );
    res.json(resources);
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};

// Delete Resource
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    // Check ownership
    if (
      !req.user ||
      resource.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resource" });
    }

    // Delete from Cloudinary if exists
    if (resource.filePublicId) {
      try {
        await cloudinary.uploader.destroy(resource.filePublicId, {
          resource_type: "auto",
        });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await resource.deleteOne();

    // Decrement contributions
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { contributions: -1 },
      });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ message: "Failed to delete resource" });
  }
};
