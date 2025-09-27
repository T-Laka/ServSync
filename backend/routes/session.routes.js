// src/routes/session.routes.js
import { Router } from 'express';
import { createSession, listSessions, updateSession } from '../controllers/session.Controller.js';
const router = Router();

router.post('/', /*auth('MANAGER|ADMIN'),*/ createSession);
router.get('/', /*auth(),*/ listSessions);
router.patch('/:sessionId', /*auth('MANAGER|ADMIN'),*/ updateSession);

export default router;
