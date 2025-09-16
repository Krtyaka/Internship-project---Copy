import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

//SignUp Controller for registering new users
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please login", success: false });
    }

    const hashedPassword = await hashPassword(password);
    const normalizedRole = role ? role.toLowerCase() : "student";

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      skills: skills || [],
    });
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        contributions: user.contributions,
      },
    });
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

//Login Controller for authenticating users
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please sign up", success: false });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    return res.status(201).json({
      message: "Login successful!",
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, role, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (role) user.role = role.toLowerCase();
    if (skills) user.skills = skills;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
