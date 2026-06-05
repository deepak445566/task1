import express from "express";


const outer = express.Router();

outer.post("/", createTask);
outer.put("/:id", updateTask);
outer.delete("/:id", deleteTask);
outer.patch("/:id/toggle", toggleTaskStatus);

export default outer;