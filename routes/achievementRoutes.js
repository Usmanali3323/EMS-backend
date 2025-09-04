import express from "express";
import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

const router = express.Router();

// Achievement Routes
router.post("/", createAchievement); // Create Achievement
router.get("/", getAllAchievements); // Get All Achievements
router.get("/:id", getAchievementById); // Get Achievement by ID
router.put("/:id", updateAchievement);   // Update Achievement
router.delete("/:id", deleteAchievement);  // Delete Achievement

export default router;
