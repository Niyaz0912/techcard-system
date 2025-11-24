import express from 'express';
import { 
  getAllTechCards,
  getTechCardById, 
  createTechCard,
  updateTechCard,
  deleteTechCard
} from '../controllers/techCardController.js';
import { authenticateToken  } from '../middleware/auth.js';
import { uploadPDF } from '../middleware/upload.js'; // ← ДОБАВЛЯЕМ

const router = express.Router();

router.use(authenticateToken );

router.get('/', getAllTechCards);
router.get('/:id', getTechCardById);
router.post('/', uploadPDF, createTechCard);
router.put('/:id', updateTechCard);
router.delete('/:id', deleteTechCard);

export default router;