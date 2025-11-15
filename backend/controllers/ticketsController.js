// backend/controllers/ticketsController.js
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');

/**
 * Create a ticket from a message ID (body: { messageId, title })
 */
exports.create = async (req, res) => {
  try {
    const { messageId, title } = req.body;
    if (!messageId) return res.status(400).json({ success: false, error: 'messageId required' });

    // Ensure message exists
    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });

    const newTicket = new Ticket({
      title: title || (msg.content ? msg.content.slice(0, 120) : 'Ticket'),
      message: messageId,
      assignee: null,
      status: 'open',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await newTicket.save();

    // Log activity
    await ActivityLog.create({
      ticket: newTicket._id,
      user: null,
      action: 'ticket_created',
      payload: { messageId },
      ts: Date.now()
    });

    res.json({ success: true, ticket: newTicket });
  } catch (err) {
    console.error('ticketsController.create error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Update a ticket (body: { assignee?, status? })
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee, status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const changes = {};
    if (assignee !== undefined) {
      ticket.assignee = assignee;
      changes.assignee = assignee;
    }
    if (status !== undefined) {
      if (!['open','in_progress','resolved'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value' });
      }
      ticket.status = status;
      changes.status = status;
    }

    ticket.updatedAt = Date.now();
    await ticket.save();

    // Log activity
    await ActivityLog.create({
      ticket: ticket._id,
      user: assignee || null,
      action: 'ticket_updated',
      payload: changes,
      ts: Date.now()
    });

    res.json({ success: true, ticket });
  } catch (err) {
    console.error('ticketsController.update error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * List tickets (optionally limited)
 */
exports.list = async (req, res) => {
  try {
    // optional query: ?status=open
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate({ path: 'message', model: 'Message' })
      .populate({ path: 'assignee', model: 'User' });

    res.json({ success: true, tickets });
  } catch (err) {
    console.error('ticketsController.list error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
