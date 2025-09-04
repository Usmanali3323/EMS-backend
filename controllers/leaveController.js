import Leave from "../models/Leave.js";


// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    const newLeave = new Leave({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: newLeave,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "firstName lastName email")
      .populate("approver", "firstName lastName email");

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employee", "firstName lastName email")
      .populate("approver", "firstName lastName email");

    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve leave
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params; // leave ka id URL me pass hoga
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    leave.status = "APPROVED"; // sirf status update
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Reject leave
export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

    leave.status = "REJECTED";
    // leave.approver = req.body.approver; // approver id
    await leave.save();

    res.status(200).json({ success: true, message: "Leave rejected", data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel leave
export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

    leave.status = "CANCELLED";
    await leave.save();

    res.status(200).json({ success: true, message: "Leave cancelled", data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
