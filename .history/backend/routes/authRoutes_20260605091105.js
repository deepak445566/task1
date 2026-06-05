import express from "express";
import { getMe, login, logout, register } from "../controllers/authControllers.js";
import { protect } from "../middleware/auth";


const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", protect, getMe);

export default authRouter;