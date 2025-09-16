import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found!", success: false });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, invalid or expired token!",
        success: false,
      });
    }
  } else {
    return res
      .status(401)
      .json({ message: "No token provided!", success: false });
  }
};
