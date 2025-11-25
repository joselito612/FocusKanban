import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import tasksRouter from "./routes/tasks.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/tasks", tasksRouter);
connectDB();
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
