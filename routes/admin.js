import { Router } from "express";
import { getAdminUserAttendanceController, getAllUserTodayAttendance } from "../controllers/admin/attendanceController.js";
import { verifyHR } from "../middlewares/auth.js";

const router = Router();

//HR
router.route("/attendance/state").get(verifyHR, getAdminUserAttendanceController)
router.route("/attendance/employees").get(verifyHR,getAllUserTodayAttendance)

export default router;