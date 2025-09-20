import mongoose from 'mongoose';

const insuranceTypeSchema = new mongoose.Schema({
  insuranceTypeName: { type: String, required: true },
  description: { type: String, default: '' }
});

const InsuranceType = mongoose.model('InsuranceType', insuranceTypeSchema);

export default InsuranceType;
