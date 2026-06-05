import express from "express";


const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id/toggle", toggleTaskStatus);

export default taskRouter;