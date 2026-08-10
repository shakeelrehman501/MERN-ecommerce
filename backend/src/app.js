import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ====================
// CORS
// ====================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// ====================
// Middleware
// ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================
// Routes
// ====================

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);

// ====================
// Error Handler
// ====================

app.use(errorHandler);

export default app;