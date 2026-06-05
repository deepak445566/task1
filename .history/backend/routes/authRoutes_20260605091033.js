import express from "express";


const authR
outer = express.Router();

authR
outer.post("/register", register);

authR
outer.post("/login", login);

authR
outer.post("/logout", logout);

authR
outer.get("/me", protect, getMe);

export default authR
outer;