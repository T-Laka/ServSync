// src/services/session.service.js
import Branch from '../models/Branch.model.js';
import Session from '../models/Session.model.js';

export async function createSessionService(payload) {
  const { branchId, counterId, insuranceTypeId, serviceDate, slots } = payload;

  // normalize serviceDate to UTC midnight
  const day = new Date(`${serviceDate}T00:00:00.000Z`);

  // branch & counter validation
  const branch = await Branch.findById(branchId).lean();
  if (!branch) throw new Error('Branch not found');

  const counter = branch.counters.find(c => String(c._id) === String(counterId));
  if (!counter) throw new Error('Counter not found in this branch');

  if (String(counter.insuranceType) !== String(insuranceTypeId)) {
    throw new Error('Selected insurance type does not match this counter');
  }

  // sanitize slots (convert string → Date if needed)
  const normalizedSlots = slots.map(s => ({
    slotId: s.slotId, // optional; model will generate if missing
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
    capacity: Number(s.capacity),
    booked: 0,
    overbook: Number(s.overbook || 0)
  }));

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
