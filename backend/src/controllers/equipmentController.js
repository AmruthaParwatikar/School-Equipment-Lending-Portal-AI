import Equipment from '../models/Equipment.js';

export const getAllEquipment = async (req, res) => {
  try {
    const { search = '', category = '', available = '' } = req.query;
    const q = {};
    if (search) q.name = { $regex: search, $options: 'i' };
    if (category) q.category = category;
    if (available !== '') {
      q.available = { $gte: Number(available) };
    }
    const items = await Equipment.find(q).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const { name, category, condition, quantity, available } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    // Safely calculate numeric fields
    const qty = Number(quantity || 1);
    const avail = available !== undefined && available !== null ? Number(available) : qty;

    const eq = await Equipment.create({
      name,
      category,
      condition,
      quantity: qty,
      available: avail
    });

    res.json(eq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const eq = await Equipment.findByIdAndUpdate(id, updates, { new: true });
    if (!eq) return res.status(404).json({ message: 'Not found' });
    res.json(eq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const id = req.params.id;
    const eq = await Equipment.findByIdAndDelete(id);
    if (!eq) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
