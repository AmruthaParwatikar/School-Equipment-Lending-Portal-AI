
import Loan from '../models/Loan.js';
import Equipment from '../models/Equipment.js';

// Helper: compute reserved quantity (pending + issued)
const reservedForEquipment = async (equipmentId) => {
  const agg = await Loan.aggregate([
    { $match: { equipmentId: equipmentId, status: { $in: ['pending','issued'] } } },
    { $group: { _id: '$equipmentId', total: { $sum: '$quantity' } } }
  ]);
  return agg.length ? agg[0].total : 0;
};

export const requestLoan = async (req, res) => {
  try {
    const { equipmentId, quantity = 1, dueDate } = req.body;
    const userId = req.user._id;
    if (!equipmentId) return res.status(400).json({ message: 'equipmentId required' });
    const eq = await Equipment.findById(equipmentId);
    if (!eq) return res.status(404).json({ message: 'Equipment not found' });
    // Check availability considering reserved
    const reserved = await reservedForEquipment(eq._id);
    if (reserved + Number(quantity) > eq.quantity) {
      return res.status(400).json({ message: 'Not enough items available for requested period' });
    }
    const loan = await Loan.create({ equipmentId: eq._id, userId, quantity: Number(quantity), dueDate, status: 'pending' });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const user = req.user;
    let loans;
    if (user.role === 'admin' || user.role === 'staff') {
      loans = await Loan.find().populate('equipmentId').populate('userId').sort({ createdAt: -1 });
    } else {
      loans = await Loan.find({ userId: user._id }).populate('equipmentId').populate('userId').sort({ createdAt: -1 });
    }
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const id = req.params.id;
    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== 'pending') return res.status(400).json({ message: 'Loan not pending' });

    const eq = await Equipment.findById(loan.equipmentId);
    if (!eq) return res.status(404).json({ message: 'Equipment not found' });

    // Check availability now
    const reserved = await reservedForEquipment(eq._id);
    if (reserved > eq.quantity) {
      return res.status(400).json({ message: 'No items available to approve' });
    }

    // Approve: mark issued and decrement available
    loan.status = 'issued';
    await loan.save();

    eq.available = Math.max(0, eq.quantity - (await reservedForEquipment(eq._id)));
    await eq.save();

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markReturned = async (req, res) => {
  try {
    const id = req.params.id;
    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== 'issued') return res.status(400).json({ message: 'Loan not issued' });

    loan.status = 'returned';
    await loan.save();

    const eq = await Equipment.findById(loan.equipmentId);
    if (eq) {
      // recompute available
      const reserved = await reservedForEquipment(eq._id);
      eq.available = Math.max(0, eq.quantity - reserved);
      await eq.save();
    }

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
