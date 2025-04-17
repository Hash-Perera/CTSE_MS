import express from "express";
import {
  register,
  login,
  getProfile,
  getAllUsers,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { hasPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", protect, getProfile);
router.get("/users", protect, hasPermission("user:manage"), getAllUsers);

export default router;
