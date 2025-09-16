import express from "express";
import {
  createProject,
  getProjects,
  joinProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", getProjects);
router.post("/:id/join", protect, joinProject);

export default router;
