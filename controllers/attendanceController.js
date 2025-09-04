import Attendance from '../models/Attendance.js'
import { ApiError } from '../util/ApiError.js';
// Employee Check-In
export const checkIn = async (req, res) => {
  try {
    const  employee  = req.employee;
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if already checked in
    let attendance = await Attendance.findOne({ employeeId:employee._id, date: dateOnly });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: "Already checked in today." });
    }
      
    if (!attendance) {
      attendance = new Attendance({
        employeeId:employee._id,
        date: dateOnly,
        checkIn: today,
      });
    } else {
      attendance.checkIn = today;
    }

    await attendance.save();
    res.status(200).json({ message: "Check-in successful", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error during check-in", error: error.message });
  }
};

// ✅ Employee Check-Out
export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date();
    
    //const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
     
     const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    console.log("Attendance record found:", todayDate);
    let attendance = await Attendance.findOne({ employeeId,date:todayDate });
    

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: "Cannot check out without check-in." });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today." });
    }

    attendance.checkOut = today;
    await attendance.save();

    res.status(200).json({ message: "Check-out successful", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error during check-out", error: error.message });
  }
};



// ✅ Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      req.body, // fields to update (checkIn, checkOut, status, etc.)
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
      data: deletedAttendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



//mine



export async function getUserAttendanceController(req, res) {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Month and year are required",
      });
    }

    // Build date range for the given month & year
    const start = new Date(year, month - 1, 1);   // e.g. 2025-09-01
    const end = new Date(year, month, 1);         // e.g. 2025-10-01

    // Find attendance records for that employee in the given month
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: attendanceRecords,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error,
      message: error.message || "Server Error",
    });
  }
}




export async function getUserAttendanceStateController(req, res) {
  try {
    const { employeeId } = req.params;
    const { year, month } = req.body;

    if (!employeeId || !month || !year) {
     throw new ApiError(400, [], "All fields are required");
    }

    // ✅ Build date range for the given month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // ✅ Fetch attendance records from DB
    const records = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // ✅ Count working days in the month (excluding Sat/Sun)
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const d = new Date(year, month - 1, day);
      const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    // ✅ Summarize stats
    let presentDays = 0,
      lateDays = 0,
      absentDays = 0;
      
      console.log(records);
      

    records.forEach((rec) => {
      if (rec.status === "present") presentDays++;
      else if(rec.status==="late" || "half-day") lateDays++;
      else if (rec.status === "Absent") absentDays++;
    });

    const attendanceRate = workingDays
      ? (((presentDays+lateDays) / workingDays) * 100).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: {
        month,
        year,
        workingDays,
        presentDays,
        lateDays,
        absentDays,
        attendanceRate,
        records,
      },
    });
  } catch (error) {
    console.error("Error in getUserAttendanceStateController:", error);
    return res
      .status(500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.error || [],
          error.message || "Internal Server Error"
        )
      );
  }
}


// async function checkAttendanceSatausController(req,res) {
//   try {
//     const {employeeId} = req.params;
  
//   } catch (error) {
//        return res
//       .status(500)
//       .json(
//         new ApiError(
//           error.statusCode || 500,
//           error.error || [],
//           error.message || "Internal Server Error"
//         )
//       );
//   }
// }