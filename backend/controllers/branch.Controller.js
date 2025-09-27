// src/controllers/branch.controller.js
import Branch from '../models/branch.model.js';

// Create a new branch
export const createBranch = async (req, res, next) => {
  try {
    const { name, code, address, counters = [] } = req.body;
    const doc = await Branch.create({ name, code, address, counters });
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

// Add a counter to an existing branch
export const addCounter = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const { name, insuranceType, isActive = true } = req.body;
    const doc = await Branch.findByIdAndUpdate(
      branchId,
      { $push: { counters: { name, insuranceType, isActive } } },
      { new: true }
    ).lean();
    res.json(doc);
  } catch (e) { next(e); }
};

// Retrieve a single branch by id
export const getBranch = async (req, res, next) => {
  try {
    const doc = await Branch.findById(req.params.branchId).lean();
    res.json(doc);
  } catch (e) { next(e); }
};

// List all branches (useful for frontend dropdowns)
export const listBranches = async (req, res, next) => {
  try {
    const list = await Branch.find().lean();
    res.json(list);
  } catch (e) { next(e); }
};


