// import mongoose from 'mongoose';

// const taskAssignSchema = new mongoose.Schema({
//   task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
//   assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile', required: true },
//   status: { type: String, enum: ['PENDING','IN_PROGRESS','DONE','BLOCKED','DELAYED'], default: 'PENDING' },
//   assignedAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// taskAssignSchema.index({ task: 1, assignee: 1 }, { unique: true });

// export default mongoose.model('TaskAssignment', taskAssignSchema);
