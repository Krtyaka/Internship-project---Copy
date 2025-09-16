import express from "express";
import {
  createProject,
  getProjects,
  joinProject,
  deleteProject,
  getProjectById,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/:id/join", protect, joinProject);
router.delete("/:id", protect, deleteProject);

export default router;
