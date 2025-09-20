import mongoose from 'mongoose';
import InsuranceType from './insuranceType.model.js';

const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  location: { type: String, required: true },
  counters: [
    {
      counterName: { type: String, required: true },
      insuranceType: { type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceType', required: true },
      timeSlots: [
        {
          startTime: { type: Date, required: true },
          endTime: { type: Date, required: true },
          availableSlots: { type: Number, required: true },
          bookedSlots: { type: Number, required: true }
        }
      ]
    }
  ]
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
