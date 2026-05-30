import { Router } from 'express';
import multer from 'multer';
import { generatePlanner, getPlanners } from '../controllers/planner.controller';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', upload.single('file'), generatePlanner);
router.get('/', getPlanners);

export default router;
