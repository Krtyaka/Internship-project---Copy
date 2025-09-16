import express from "express";
import { getMe } from "../controllers/authController.js";
import {
  loginValidation,
  signupValidation,
} from "../middleware/authValidation.js";
import { login, signUp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//test route
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Auth route working!",
  });
});

router.post("/signup", signupValidation, signUp);
router.post("/login", loginValidation, login);

router.get("/me", protect, getMe);

export default router;
