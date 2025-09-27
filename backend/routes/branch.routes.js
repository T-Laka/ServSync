// src/routes/branch.routes.js
import { Router } from 'express';
import { createBranch, addCounter, getBranch } from '../controllers/branch.controller.js ';
const router = Router();

router.post('/', /*auth('ADMIN|MANAGER'),*/ createBranch);
router.post('/:branchId/counters', /*auth('ADMIN|MANAGER'),*/ addCounter);
router.get('/:branchId', /*auth(),*/ getBranch);

export default router;
