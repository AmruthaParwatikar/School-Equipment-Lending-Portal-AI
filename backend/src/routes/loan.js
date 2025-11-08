
import express from 'express';
import { requestLoan, getAllLoans, approveLoan, markReturned } from '../controllers/loanController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, requestLoan);
router.get('/', authMiddleware, getAllLoans);
router.put('/:id/approve', authMiddleware, requireRole(['admin','staff']), approveLoan);
router.put('/:id/return', authMiddleware, requireRole(['admin','staff']), markReturned);

export default router;
