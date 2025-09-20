import Branch from '../models/branch.model.js';
import InsuranceType from '../models/insuranceType.model.js';

// 1. Get all branches
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate('counters.insuranceType');
    if (!branches || branches.length === 0) {
      return res.status(404).json({ message: 'No branches found' });
    }
    res.status(200).json(branches);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching branches', error: err.message });
  }
};

// 2. Get a branch by ID
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('counters.insuranceType');
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json(branch);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching branch', error: err.message });
  }
};

// 3. Create a new branch with counters and time slots
export const createBranch = async (req, res) => {
  try {
    const { branchName, location, counters } = req.body;

    // Validate input
    if (!branchName || !location || !counters || counters.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the insurance type exists for each counter
    for (const counter of counters) {
      const insuranceTypeObj = await InsuranceType.findById(counter.insuranceType);
      if (!insuranceTypeObj) {
        return res.status(404).json({ message: `Insurance type not found for counter: ${counter.counterName}` });
      }
    }

    // Create the branch
    const branch = new Branch({
      branchName,
      location,
      counters
    });

    // Save the branch
    await branch.save();

    res.status(201).json(branch);
  } catch (err) {
    console.error('Error creating branch:', err);
    res.status(500).json({ message: 'Error creating branch', error: err.message });
  }
};

// 4. Update a branch (e.g., add/update counters or time slots)
export const updateBranch = async (req, res) => {
  const { branchId, counters } = req.body;

  try {
    // Find the branch by branchId
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Update counters
    branch.counters = counters;

    // Save the updated branch
    await branch.save();

    res.status(200).json({ message: 'Branch updated successfully', branch });
  } catch (err) {
    res.status(500).json({ message: 'Error updating branch', error: err.message });
  }
};

// 5. Delete a branch by ID
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting branch', error: err.message });
  }
};

export default {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
};
