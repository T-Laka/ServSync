import Session from '../models/session.model.js';
import Queue from '../models/queue.model.js';
import Branch from '../models/branch.model.js';
import InsuranceType from '../models/insuranceType.model.js';

// 1. Get all sessions for a particular branch and insurance type
export const getSessions = async (req, res) => {
  try {
    const { branchId, insuranceTypeId } = req.params;
    
    // Find sessions for the given branch and insurance type
    const sessions = await Session.find({ 
      branch: branchId, 
      insuranceType: insuranceTypeId 
    }).populate('branch').populate('insuranceType');

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found' });
    }

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
};

// 2. Create a new session with time slots
export const createSession = async (req, res) => {
  try {
    const { branch, counter, insuranceType, timeSlots, nonWorkingDays } = req.body;

    // Validate input
    if (!branch || !counter || !insuranceType || !timeSlots || timeSlots.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the branch and insurance type exist
    const branchObj = await Branch.findById(branch);
    if (!branchObj) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const insuranceTypeObj = await InsuranceType.findById(insuranceType);
    if (!insuranceTypeObj) {
      return res.status(404).json({ message: 'Insurance type not found' });
    }

    // Create the session
    const session = new Session({
      branch,
      counter,
      insuranceType,
      timeSlots,
      nonWorkingDays
    });

    // Save the session
    await session.save();

    // Initialize the queue for the session
    const queue = new Queue({
      session: session._id,
      tokens: [] // Initially no tokens
    });

    await queue.save();

    res.status(201).json(session);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: 'Error creating session', error: err.message });
  }
};

// 3. Get a session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('branch')
      .populate('insuranceType');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session', error: err.message });
  }
};

// 4. Add a time slot to an existing session
export const addTimeSlot = async (req, res) => {
  const { sessionId, newTimeSlot } = req.body;

  try {
    // Find the session by sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Add the new time slot to the existing session
    session.timeSlots.push(newTimeSlot);
    await session.save();

    res.status(200).json({ message: 'Time slot added successfully', session });
  } catch (err) {
    res.status(500).json({ message: 'Error adding time slot', error: err.message });
  }
};

// 5. Update an existing session (e.g., updating time slots, non-working days)
export const updateSession = async (req, res) => {
  const { sessionId, timeSlots, nonWorkingDays } = req.body;

  try {
    // Find the session by sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update the session's time slots and non-working days
    session.timeSlots = timeSlots || session.timeSlots;
    session.nonWorkingDays = nonWorkingDays || session.nonWorkingDays;

    // Save the updated session
    await session.save();

    res.status(200).json({ message: 'Session updated successfully', session });
  } catch (err) {
    res.status(500).json({ message: 'Error updating session', error: err.message });
  }
};

// 6. Delete a session (Optional, if you want to allow deleting sessions)
export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find and delete the session by sessionId
    const session = await Session.findByIdAndDelete(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Also, delete associated queue
    await Queue.findOneAndDelete({ session: sessionId });

    res.status(200).json({ message: 'Session and associated queue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting session', error: err.message });
  }
};

export default {
  getSessions,
  createSession,
  getSessionById,
  addTimeSlot,
  updateSession,
  deleteSession
};
