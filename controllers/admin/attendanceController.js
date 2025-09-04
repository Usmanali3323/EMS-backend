import Attendance from "../../models/Attendance.js";
import EmployeeProfile from "../../models/EmployeeProfile.js";
import { ApiError } from "../../util/ApiError.js";


export async function getAdminUserAttendanceController(req, res) {
  try {
    const now = new Date();

    // Convert to PKT (UTC+5)
    const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    // Start of today in PKT
    const startOfDay = new Date(pktNow.getFullYear(), pktNow.getMonth(), pktNow.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    // Get employees
    const employees = await EmployeeProfile.find({ role: "Employee" }).select("_id");

    // Get today's attendance records (range query)
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

   
    

    let present = 0;
    let late = 0;
    let absent = 0;

    employees.forEach((emp) => {
      const record = attendanceRecords.find(
     (a) =>{
        console.log("employeeId : ",  a.employeeId);
        console.log("emp._id : ",emp._id);
        
        
      return  a.employeeId.toString() == emp._id.toString()
     }
        );
      
      if (!record || !record.checkIn) {
        absent++;
      } else {
        if (record.status == "half-day" || "late") {
          late++;
        } else {
          present++;
        }
      }
      
    });

    res.status(200).json({
      success: true,
      date: startOfDay,
      stats: {
        total: employees.length,
        present:present+late,
        late,
        absent,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(error.statusCode || 500, error, error.message));
  }
}


export async function getAllUserTodayAttendance(req, res) {
  try {
    // Get today's start and end in UTC
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all attendance records for today
    const attendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("employeeId", "firstName lastName email department");

    res.status(200).json({
      success: true,
      count: attendance.length,
      employees:attendance,
      message:"All Employees today attendance records"
    });
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(error.statusCode || 500, error, error.message));
  }
}
