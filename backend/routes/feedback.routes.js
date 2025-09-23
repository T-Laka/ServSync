import { Router } from "express";
import * as FeedbackController from "../controllers/Feedback.Controller.js";
import Feedback from "../models/Feedback.models.js";

const router = Router();

// Feedback endpoints
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, message, rating } = req.body;
    const fb = new Feedback({ username, email, message, rating });
    await fb.save();
    res.json(fb);
  } catch (err) {
    res.status(400).json({ error: "Failed to add feedback" });
  }
});

router.put("/:id", FeedbackController.updateFeedback);
router.delete("/:id", FeedbackController.deleteFeedback);
router.post("/:id/reply", FeedbackController.addReply);
// Update a reply
router.put('/:id/reply/:replyId', FeedbackController.updateReply);
// Delete a reply
router.delete('/:id/reply/:replyId', FeedbackController.deleteReply);

export default router;
