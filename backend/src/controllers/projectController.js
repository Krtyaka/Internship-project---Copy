import Project from "../models/project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired } = req.body;
    const project = await Project.create({
      title,
      description,
      skillsRequired,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    // Increment user contributions
    await User.findByIdAndUpdate(req.user._id, { $inc: { contributions: +1 } });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Authorization check
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();

    // Decrement user contributions
    await User.findByIdAndUpdate(req.user._id, { $inc: { contributions: -1 } });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    //checking if already a member
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    project.members.push(req.user._id);
    await project.save();

    res.json({ message: "Joined project successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Failed to join project" });
  }
};
