// scripts/seedRoles.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const seedRoles = async () => {
  await Role.deleteMany();

  const roles = [
    {
      name: "admin",
      permissions: [
        "user:view",
        "user:manage",
        "product:create",
        "product:delete",
      ],
    },
    {
      name: "seller",
      permissions: ["product:create", "product:update", "product:view"],
    },
    {
      name: "customer",
      permissions: ["product:view"],
    },
  ];

  await Role.insertMany(roles);
  console.log("✅ Roles seeded successfully");
  process.exit();
};

seedRoles();
