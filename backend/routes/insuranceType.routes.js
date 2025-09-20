import express from 'express';
import insuranceTypeController from '../controllers/insuranceType.controller.js';

const router = express.Router();

// Get all insurance types
router.get('/', insuranceTypeController.getInsuranceTypes);

// Get insurance type by ID
router.get('/:id', insuranceTypeController.getInsuranceTypeById);

// Create a new insurance type
router.post('/', insuranceTypeController.createInsuranceType);

// Update an existing insurance type
router.put('/update', insuranceTypeController.updateInsuranceType);

// Delete an insurance type by ID
router.delete('/:id', insuranceTypeController.deleteInsuranceType);

export default router;
