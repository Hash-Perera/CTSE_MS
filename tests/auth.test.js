import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // Make sure your app exports the Express instance
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();
  await Role.deleteMany();
});

describe("Auth Controller", () => {
  let role;

  beforeEach(async () => {
    role = await Role.create({
      name: "customer",
      permissions: ["read_profile"],
    });
  });

  test("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John",
      email: "john@example.com",
      password: "123456",
      role: role._id.toString(),
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.token).toBeDefined();
  });

  // test("should not register with existing email", async () => {
  //   await User.create({
  //     name: "Jane",
  //     email: "jane@example.com",
  //     password: await bcrypt.hash("123456", 10),
  //     role: role._id,
  //   });

  //   const res = await request(app).post("/api/auth/register").send({
  //     name: "Jane",
  //     email: "jane@example.com",
  //     password: "123456",
  //     role: role._id.toString(),
  //   });

  //   expect(res.statusCode).toBe(400);
  //   expect(res.body.message).toBe("Email already registered");
  // });

  // test("should login a user", async () => {
  //   await User.create({
  //     name: "John",
  //     email: "john@example.com",
  //     password: await bcrypt.hash("123456", 10),
  //     role: role._id,
  //   });

  //   const res = await request(app).post("/api/auth/login").send({
  //     email: "john@example.com",
  //     password: "123456",
  //   });

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.user.email).toBe("john@example.com");
  //   expect(res.body.token).toBeDefined();
  // });

  // test("should return profile when authenticated", async () => {
  //   const user = await User.create({
  //     name: "John",
  //     email: "john@example.com",
  //     password: await bcrypt.hash("123456", 10),
  //     role: role._id,
  //   });

  //   const loginRes = await request(app).post("/api/auth/login").send({
  //     email: "john@example.com",
  //     password: "123456",
  //   });

  //   const token = loginRes.body.token;

  //   const profileRes = await request(app)
  //     .get("/api/auth/me")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(profileRes.statusCode).toBe(200);
  //   expect(profileRes.body.email).toBe("john@example.com");
  // });
});
