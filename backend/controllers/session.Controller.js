// src/controllers/session.controller.js
import { createSessionService, listSessionsService, updateSessionService } from '../services/session.service.js';

export const createSession = async (req,res,next)=>{
  try{
    const doc = await createSessionService(req.body);
    res.status(201).json(doc);
  }catch(e){ next(e); }
};

export const listSessions = async (req,res,next)=>{
  try{
    const { branchId, date } = req.query; // date = 'YYYY-MM-DD'
    const list = await listSessionsService({ branchId, date });
    res.json(list);
  }catch(e){ next(e); }
};

export const updateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const doc = await updateSessionService(sessionId, req.body);
    res.json(doc);
  } catch (e) { next(e); }
};
