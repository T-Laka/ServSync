import express from 'express';
import branchController from '../controllers/branch.controller.js';     

const router = express.Router();

// Get all branches
router.get('/', branchController.getBranches);

// Get a branch by ID
router.get('/:id', branchController.getBranchById);

// Create a new branch with counters and time slots
router.post('/', branchController.createBranch);

// Update an existing branch (e.g., counters, time slots)
router.put('/update', branchController.updateBranch);

// Delete a branch by ID
router.delete('/:id', branchController.deleteBranch);

export default router;