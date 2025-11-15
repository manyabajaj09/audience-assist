const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
channel: { type: String, default: 'manual' },
externalId: { type: String },
sender: { type: String },
content: { type: String, required: true },
receivedAt: { type: Date, default: Date.now },
tag: { type: String, enum: ['question','request','complaint','praise','other'], default: 'other' },
sentiment: { type: String, enum: ['positive','neutral','negative'], default: 'neutral' },
priority: { type: Number, default: 3 },
processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);