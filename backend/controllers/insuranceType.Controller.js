import InsuranceType from '../models/insuranceType.model.js';

// 1. Get all insurance types
export const getInsuranceTypes = async (req, res) => {
  try {
    const insuranceTypes = await InsuranceType.find();
    if (!insuranceTypes || insuranceTypes.length === 0) {
      return res.status(404).json({ message: 'No insurance types found' });
    }
    res.status(200).json(insuranceTypes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching insurance types', error: err.message });
  }
};

// 2. Get insurance type by ID
export const getInsuranceTypeById = async (req, res) => {
  try {
    const insuranceType = await InsuranceType.findById(req.params.id);
    if (!insuranceType) {
      return res.status(404).json({ message: 'Insurance type not found' });
    }
    res.status(200).json(insuranceType);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching insurance type', error: err.message });
  }
};

// 3. Create a new insurance type
export const createInsuranceType = async (req, res) => {
  try {
    const { insuranceTypeName, description } = req.body;

    // Validate input
    if (!insuranceTypeName) {
      return res.status(400).json({ message: 'Insurance type name is required' });
    }

    // Create a new insurance type
    const newInsuranceType = new InsuranceType({
      insuranceTypeName,
      description
    });

    await newInsuranceType.save();

    res.status(201).json(newInsuranceType);
  } catch (err) {
    console.error('Error creating insurance type:', err);
    res.status(500).json({ message: 'Error creating insurance type', error: err.message });
  }
};

// 4. Update an insurance type
export const updateInsuranceType = async (req, res) => {
  const { id, insuranceTypeName, description } = req.body;

  try {
    const insuranceType = await InsuranceType.findById(id);
    if (!insuranceType) {
      return res.status(404).json({ message: 'Insurance type not found' });
    }

    insuranceType.insuranceTypeName = insuranceTypeName || insuranceType.insuranceTypeName;
    insuranceType.description = description || insuranceType.description;

    await insuranceType.save();

    res.status(200).json({ message: 'Insurance type updated successfully', insuranceType });
  } catch (err) {
    res.status(500).json({ message: 'Error updating insurance type', error: err.message });
  }
};

// 5. Delete an insurance type by ID
export const deleteInsuranceType = async (req, res) => {
  try {
    const insuranceType = await InsuranceType.findByIdAndDelete(req.params.id);
    if (!insuranceType) {
      return res.status(404).json({ message: 'Insurance type not found' });
    }

    res.status(200).json({ message: 'Insurance type deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting insurance type', error: err.message });
  }
};

export default {
  getInsuranceTypes,
  getInsuranceTypeById,
  createInsuranceType,
  updateInsuranceType,
  deleteInsuranceType
};
