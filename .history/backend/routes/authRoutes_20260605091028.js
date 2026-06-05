import express from "express";


const outer = express.Router();

outer.post("/register", register);

outer.post("/login", login);

outer.post("/logout", logout);

outer.get("/me", protect, getMe);

export default outer;