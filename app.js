import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import rateLimit from "express-rate-limit";

const app = express();

// Connect to MongoDB
connectDB();

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Middleware
app.use(express.json()); // for parsing application/json
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet()); // Helps mitigate attacks like XSS, clickjacking, MIME sniffing,
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the CTSE API!");
});

app.use("/api/auth", authRoutes);

export default app;
