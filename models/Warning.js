import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile', required: true },
  reason: { type: String, required: true },
  level: { type: Number, min: 1, max: 3, required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' },
  issuedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Warning', warningSchema);
