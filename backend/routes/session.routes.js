// src/routes/session.routes.js
import { Router } from 'express';
import { createSession, listSessions } from '../controllers/session.controller.js ';
const router = Router();

router.post('/', /*auth('MANAGER|ADMIN'),*/ createSession);
router.get('/', /*auth(),*/ listSessions);

export default router;
