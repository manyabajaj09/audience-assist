const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
title: { type: String },
message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
status: { type: String, enum: ['open','in_progress','resolved'], default: 'open' },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ticket', TicketSchema);