import express from "express"
import {updateAttendance,checkIn,checkOut, deleteAttendance, getUserAttendanceController, getUserAttendanceStateController} from './../controllers/attendanceController.js'
import verifyUser, { verifyHR } from "../middlewares/auth.js";

const router = express.Router();


router.post("/checkin/:employeeId", verifyUser, checkIn);
router.post("/checkout/:employeeId",verifyUser, checkOut);
router.put("/admin/:id", updateAttendance); // Update attendance by ID
router.delete("/:id", deleteAttendance); // Delete attendance by ID

router.route(`/recent/:employeeId`).post(verifyUser,getUserAttendanceController);
router.route(`/stats/:employeeId`).post(verifyUser, getUserAttendanceStateController);


export default router;
