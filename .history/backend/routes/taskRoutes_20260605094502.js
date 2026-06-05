import express from "express";
import { createTask, deleteTask, toggleTaskStatus, updateTask } from "../controllers/taskControllers";


const taskRouter = express.Router();

taskRouter.post("/", protectcreateTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id/toggle", toggleTaskStatus);

export default taskRouter;