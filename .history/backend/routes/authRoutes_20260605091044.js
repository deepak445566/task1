import express from "express";


const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", protect, getMe);

export default authRouter;