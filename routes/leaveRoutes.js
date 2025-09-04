import express from "express";
import {
  applyLeave,
  getAllLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  cancelLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

// Employee applies leave
router.post("/applyLeave", applyLeave);

// Get all leaves
router.get("/", getAllLeaves);

// Get leave by id
router.get("/:id", getLeaveById);

// Approve leave
router.put("/approve/:id", approveLeave);

// Reject leave
router.put("/reject/:id", rejectLeave);

// Cancel leave
router.put("/cancel/:id", cancelLeave);

export default router;
