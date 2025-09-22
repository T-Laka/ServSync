import Feedback from "../models/Feedback.js";

// Update Feedback (Admin only)
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, rating } = req.body;
    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    if (typeof message === 'string' && message.trim()) feedback.message = message;
    if (typeof rating === 'number') feedback.rating = rating;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update feedback' });
  }
};

// Delete Feedback (Admin only)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const fb = await Feedback.findByIdAndDelete(id);
    if (!fb) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to delete feedback' });
  }
};

// Add Reply (Admin or User)
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, message, email } = req.body;
    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    const reply = { sender, message };
    if (sender === "user" && email) reply.email = email;
    feedback.replies.push(reply);
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to add reply' });
  }
};
