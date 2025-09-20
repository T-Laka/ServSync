import mongoose from 'mongoose';
import Branch from './branch.model.js';
import InsuranceType from './insuranceType.model.js';

const sessionSchema = new mongoose.Schema({
  branch: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true
  },
  counter: { 
    type: String, 
    required: true
  },
  insuranceType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'InsuranceType', 
    required: true
  },
  timeSlots: [
    {
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      availableSlots: { type: Number, required: true },
      bookedSlots: { type: Number, required: true }
    }
  ],
  nonWorkingDays: { 
    type: [Date], 
    default: [] 
  }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
