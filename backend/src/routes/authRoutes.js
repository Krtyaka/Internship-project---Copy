import express from "express";
import {
  loginValidation,
  signupValidation,
} from "../middleware/authValidation.js";
import { login, signUp } from "../controllers/authController.js";

const router = express.Router();

//test route
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Auth route working!",
  });
});

router.post("/signup", signupValidation, signUp);
router.post("/login", loginValidation, login);

//protected route example to test JWT authentication
router.get("/me", (req, res) => {
  res.status(200).json({ message: "Protected route accessed!" });
});

export default router;

