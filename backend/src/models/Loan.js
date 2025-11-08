
import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending','issued','returned','rejected','approved'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);
