const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: String, enum: ['Tech','Culture','Science','Gaming','Sports','Other'], required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Thread', ThreadSchema);