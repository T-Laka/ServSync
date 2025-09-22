import mongoose from 'mongoose';
const { Schema } = mongoose;

const roleSchema = new Schema({
    nic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    workArea: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, default: 'active', required: true },
    updatedBy: { type: String },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Export as default for ES Module
const Role = mongoose.model('roleModel', roleSchema);
export default Role;
