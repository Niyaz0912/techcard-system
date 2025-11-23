import express from 'express';
import { 
  getAllTechCards,
  getTechCardById, 
  createTechCard,
  updateTechCard,
  deleteTechCard
} from '../controllers/techCardController.js';

const router = express.Router();

router.get('/', getAllTechCards);
router.get('/:id', getTechCardById);
router.post('/', createTechCard);
router.put('/:id', updateTechCard);
router.delete('/:id', deleteTechCard);

export default router;