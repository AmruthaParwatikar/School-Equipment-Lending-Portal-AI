
import express from 'express';
import { getAllEquipment, addEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getAllEquipment);
router.post('/', authMiddleware, requireRole(['admin','staff']), addEquipment);
router.put('/:id', authMiddleware, requireRole(['admin','staff']), updateEquipment);
router.delete('/:id', authMiddleware, requireRole(['admin','staff']), deleteEquipment);

export default router;
