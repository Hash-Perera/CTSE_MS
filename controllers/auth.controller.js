import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generate-token.util.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Convert role to ObjectId explicitly
  const roleId = new mongoose.Types.ObjectId(role);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: roleId,
  });

  const token = generateToken({ id: newUser._id, role: newUser.role });

  res.status(201).json({
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("role");
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  // add role name + permissions to token if needed

  const token = generateToken({
    id: user._id,
    role: user.role.name,
    permissions: user.role.permissions,
  });

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};
