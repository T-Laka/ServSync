import { Router } from 'express';
import * as ComplaintController from '../controllers/ComplaintController.js';

const router = Router();

// Create a new complaint
router.post('/', ComplaintController.createComplaint);

// Update complaint status/response
router.put('/:id/status', ComplaintController.updateComplaintStatus);

// Get all complaints (optional ?email filter)
router.get('/', ComplaintController.getAllComplaints);

// Get complaint by referenceId
router.get('/ref/:referenceId', ComplaintController.getComplaintByReferenceId);

// Get complaint by Mongo _id
router.get('/:id', ComplaintController.getComplaintById);

// Public update/delete by owner (email must match)
router.put('/:id', ComplaintController.updateComplaintPublic);
router.delete('/:id', ComplaintController.deleteComplaintPublic);

// Respond to a complaint
router.post('/:id/respond', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { response: req.body.response },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
