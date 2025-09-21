// src/routes/insuranceType.routes.js
import { Router } from 'express';
import { createInsuranceType, listInsuranceTypes } from '../controllers/insuranceType.controller.js ';
// import auth from '../middlewares/auth.js' // hook later
const router = Router();

router.post('/', /*auth('ADMIN'),*/ createInsuranceType);
router.get('/', /*auth(),*/ listInsuranceTypes);

export default router;
