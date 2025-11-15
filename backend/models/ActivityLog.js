const mongoose = require('mongoose');
const ActivityLogSchema = new mongoose.Schema({
ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
action: { type: String },
payload: { type: Object },
ts: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ActivityLog', ActivityLogSchema);