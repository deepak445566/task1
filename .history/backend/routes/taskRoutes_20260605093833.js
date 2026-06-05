import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../controllers/taskController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.route("/").get(getTasks).post(createTask);

router.route("/:id").put(updateTask).delete(deleteTask);

router.patch("/:id/toggle", toggleTaskStatus);

export default router;