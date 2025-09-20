const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({

    nic: { type: String, required: true, unique: true }, // unique identifier for the person
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    workArea: { type: String, required: true },
    password: { type: String, required: true }, // should be hashed
    status: { type: String, default: 'active', required: true },
    updatedBy: { type: String }, // or: { type: Schema.Types.ObjectId, ref: 'userModel' }
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('roleModel', roleSchema);
