import "rootpath"; // Ensure TypeScript recognizes this
import express from "express";
import cors from "cors";
import { errorHandler } from "./_middleware/error-handler";
import userRoutes from "./users/user.contoller";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/users", userRoutes);

// Global error handler
app.use(errorHandler);

// Set up server port
const PORT = process.env.NODE_ENV === "production" ? Number(process.env.PORT) || 80 : 4000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));