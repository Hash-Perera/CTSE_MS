import express from "express";
import {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser,
  getAllRoles,
  assignRole,
  updateProfile,
  deleteAccount,
  forgotPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { hasPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);
router.delete("/delete-account", protect, deleteAccount);
router.post("/forgot-password", forgotPassword);

router.get("/users", protect, hasPermission("user:manage"), getAllUsers);
router.delete("/users/:id", protect, hasPermission("user:manage"), deleteUser);
router.get("/roles", protect, hasPermission("role:read"), getAllRoles);
router.post("/assign-role", protect, hasPermission("role:assign"), assignRole);

export default router;
