const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
    // Example fields, customize as needed
    name: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Control', controlSchema);