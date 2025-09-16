import Project from "../models/project.js";

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
