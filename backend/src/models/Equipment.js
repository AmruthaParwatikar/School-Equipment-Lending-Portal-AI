
import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },
  condition: { type: String, default: 'Good' },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Equipment', equipmentSchema);
