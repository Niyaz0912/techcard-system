// src/routes/operations.js
import express from 'express';
import { 
  getOperationsByTechCard,
  createOperation,
  updateOperation,
  deleteOperation
} from '../controllers/operationController.js';

const router = express.Router();

router.get('/tech-card/:techCardId', getOperationsByTechCard);
router.post('/', createOperation);
router.put('/:id', updateOperation);
router.delete('/:id', deleteOperation);

export default router;