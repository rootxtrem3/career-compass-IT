import express from "express";
import cors from "cors";
import { json } from "express";
import { errorHandler } from "./middleware/error.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import assessmentsRouter from "./routes/assessments.js";
import skillsRouter from "./routes/skills.js";
import careersRouter from "./routes/careers.js";
import progressRouter from "./routes/progress.js";
import usersRouter from "./routes/users.js";
import jobsRouter from "./routes/jobs.js";

const app = express();

app.use(cors());
app.use(json({ limit: "1mb" }));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/assessments", assessmentsRouter);
app.use("/skills", skillsRouter);
app.use("/careers", careersRouter);
app.use("/progress", progressRouter);
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);

app.use(errorHandler);

export default app;
