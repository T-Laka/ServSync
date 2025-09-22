// src/controllers/branch.controller.js
import Branch from '../models/Branch.model.js ';

export const createBranch = async (req,res,next)=>{
  try{
    const { name, code, address, counters = [] } = req.body;
    const doc = await Branch.create({ name, code, address, counters });
    res.status(201).json(doc);
  }catch(e){ next(e); }
};

export const addCounter = async (req,res,next)=>{
  try{
    const { branchId } = req.params;
    const { name, insuranceType, isActive = true } = req.body;
    const doc = await Branch.findByIdAndUpdate(
      branchId,
      { $push: { counters: { name, insuranceType, isActive } } },
      { new: true }
    );
    res.json(doc);
  }catch(e){ next(e); }
};

export const getBranch = async (req,res,next)=>{
  try{
    const doc = await Branch.findById(req.params.branchId).lean();
    res.json(doc);
  }catch(e){ next(e); }
};


