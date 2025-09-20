import express from 'express';
import sessionController from '../controllers/session.controller.js';   

const router = express.Router();

// Get all sessions for a particular branch and insurance type
router.get('/:branchId/:insuranceTypeId', sessionController.getSessions);

// Create a new session with time slots
router.post('/', sessionController.createSession);

// Get a session by ID
router.get('/:id', sessionController.getSessionById);

// Add a time slot to an existing session
router.post('/add-time-slot', sessionController.addTimeSlot);

// Update an existing session
router.put('/update-session', sessionController.updateSession);

// Delete a session (optional)
router.delete('/:sessionId', sessionController.deleteSession);

export default router;
