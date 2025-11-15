// backend/routes/tickets.js
const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');
const Ticket = require('../models/Ticket');
const ActivityLog = require('../models/ActivityLog');
const Message = require('../models/Message');

/**
 * Create ticket (body: { messageId, title })
 */
router.post('/', ticketsController.create);

/**
 * List tickets
 */
router.get('/', ticketsController.list);

/**
 * Get ticket by id (populates message & assignee)
 */
router.get('/:id', async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id)
      .populate({ path: 'message', model: 'Message' })
      .populate({ path: 'assignee', model: 'User' });

    if (!t) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.json({ success: true, ticket: t });
  } catch (err) {
    console.error('GET /tickets/:id error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * Update ticket (delegates to controller)
 */
router.patch('/:id', ticketsController.update);

/**
 * Assign ticket to agent (body: { assignee })
 * Convenience endpoint
 */
router.patch('/:id/assign', async (req, res) => {
  try {
    const { assignee } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    ticket.assignee = assignee;
    ticket.updatedAt = Date.now();
    await ticket.save();

    await ActivityLog.create({
      ticket: ticket._id,
      user: assignee || null,
      action: 'assigned',
      payload: { assignee },
      ts: Date.now()
    });

    res.json({ success: true, ticket });
  } catch (err) {
    console.error('PATCH /tickets/:id/assign error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * Update ticket status (body: { status })
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open','in_progress','resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();

    await ActivityLog.create({
      ticket: ticket._id,
      user: req.body.user || null,
      action: 'status_changed',
      payload: { status },
      ts: Date.now()
    });

    res.json({ success: true, ticket });
  } catch (err) {
    console.error('PATCH /tickets/:id/status error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * Close ticket (alias for status = resolved)
 */
router.post('/:id/close', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    ticket.status = 'resolved';
    ticket.updatedAt = Date.now();
    await ticket.save();

    await ActivityLog.create({
      ticket: ticket._id,
      user: req.body.user || null,
      action: 'closed',
      payload: {},
      ts: Date.now()
    });

    res.json({ success: true, ticket });
  } catch (err) {
    console.error('POST /tickets/:id/close error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
