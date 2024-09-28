// routes/textTo3D.js

import express from 'express';
import { createTextTo3DModel, getTextTo3DTaskHandler } from '../controllers/textTo3D.js';

const router = express.Router();

// Route to generate 3D model
router.post('/generate-3d-model', createTextTo3DModel);

// Route to retrieve task data using the correct handler
router.get('/v2/text-to-3d/:id', getTextTo3DTaskHandler);

export default router;