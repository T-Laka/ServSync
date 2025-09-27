// src/services/session.service.js
import Branch from '../models/branch.model.js';
import Session from '../models/session.model.js';

export async function createSessionService(payload) {
  const { branchId, counterId, insuranceTypeId, serviceDate, slots } = payload;

  // normalize serviceDate to UTC midnight
  function parseServiceDate(input) {
    if (!input) throw new Error('serviceDate is required');
    // If already a Date
    if (input instanceof Date) {
      if (isNaN(input.getTime())) throw new Error('Invalid serviceDate');
      return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
    }
    const s = String(input);
    // If format YYYY-MM-DD, use Date.UTC
    const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const [_, y, m, d] = ymd;
      return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    }
    // Try parsing an ISO date/time string
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
    }
    throw new Error('Invalid serviceDate format');
  }

  let day;
  try {
    day = parseServiceDate(serviceDate);
  } catch (err) {
    throw new Error(`Invalid serviceDate: ${err.message}`);
  }

  // branch & counter validation
  const branch = await Branch.findById(branchId).lean();
  if (!branch) throw new Error('Branch not found');

  const counter = branch.counters.find(c => String(c._id) === String(counterId));
  if (!counter) throw new Error('Counter not found in this branch');

  if (String(counter.insuranceType) !== String(insuranceTypeId)) {
    throw new Error('Selected insurance type does not match this counter');
  }

  // sanitize slots (convert string → Date if needed) and validate
  if (!Array.isArray(slots) || slots.length === 0) throw new Error('Slots must be a non-empty array');
  const normalizedSlots = slots.map((s, idx) => {
    const start = s.startTime instanceof Date ? s.startTime : new Date(String(s.startTime));
    const end = s.endTime instanceof Date ? s.endTime : new Date(String(s.endTime));
    if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error(`Invalid startTime/endTime in slot ${idx + 1}`);
    if (start >= end) throw new Error(`Slot ${idx + 1}: startTime must be before endTime`);
    // ensure slots fall within the same UTC day as serviceDate
    const svcDay = day.toISOString().slice(0,10);
    if (!start.toISOString().startsWith(svcDay) || !end.toISOString().startsWith(svcDay)) {
      throw new Error(`Slot ${idx + 1}: times must be within serviceDate day (UTC)`);
    }
    return {
      slotId: s.slotId, // optional; model will generate if missing
      startTime: start,
      endTime: end,
      capacity: Number(s.capacity),
      booked: Number(s.booked || 0),
      overbook: Number(s.overbook || 0)
    };
  });

  try {
    const doc = await Session.create({
      branch: branchId,
      counterId,
      insuranceType: insuranceTypeId,
      serviceDate: day,
      slots: normalizedSlots,
      status: 'SCHEDULED',
      holidaysFlag: false
    });
    return doc;
  } catch (err) {
    if (err && err.code === 11000) {
      throw new Error('A session for this branch/counter/date already exists');
    }
    throw err;
  }
}

export async function listSessionsService({ branchId, date }) {
  const day = new Date(`${date}T00:00:00.000Z`);
  return Session.find({ branch: branchId, serviceDate: day }).lean();
}
