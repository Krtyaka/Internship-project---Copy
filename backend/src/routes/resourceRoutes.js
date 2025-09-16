import express from "express";
import {
  createResource,
  getResources,
  deleteResource,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Create: accepts multipart/form-data with 'file' field OR application/json with fileUrl
router.post("/", protect, upload.single("file"), createResource);

// List
router.get("/", getResources);

// Delete
router.delete("/:id", protect, deleteResource);

export default router;
