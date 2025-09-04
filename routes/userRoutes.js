import express from "express";
import { registerUser, loginUser, getAllUsers,approveUser,rejectUser } from "../controllers/userController.js";
import { verifyHR } from "../middlewares/auth.js";

const router = express.Router();

// Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", verifyHR, getAllUsers);
 router.post("/approve/:userId", approveUser)
 router.post("/reject/:userId", rejectUser);


export default router;
