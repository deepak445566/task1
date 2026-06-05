import express from "express";
import { createTask, deleteTask, getTasks, toggleTaskStatus, updateTask } from "../controllers/taskControllers.js";
import { protect } from "../middleware/auth.js";


const taskRouter = express.Router();

taskRouter.post("/", protect,createTask);
taskRouter.get("/",protect,getTasks)
taskRouter.put("/:id",protect, updateTask);
taskRouter.delete("/:id",protect, deleteTask);
taskRouter.patch("/:id/toggle",protect, toggleTaskStatus);

export default taskRouter;