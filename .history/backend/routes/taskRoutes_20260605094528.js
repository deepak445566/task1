import express from "express";
import { createTask, deleteTask, toggleTaskStatus, updateTask } from "../controllers/taskControllers";
import { protect } from "../middleware/auth";


const taskRouter = express.Router();

taskRouter.post("/", protect,createTask);
taskRouter.put("/:id",protect updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id/toggle", toggleTaskStatus);

export default taskRouter;