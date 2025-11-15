const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Ticket = require('../models/Ticket');

/**
 * Get overview analytics
 */
router.get('/overview', async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

    res.json({
      success: true,
      data: {
        totalMessages,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets
      }
    });
  } catch (err) {
    console.error('GET /analytics/overview error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get messages by tag distribution
 */
router.get('/messages-by-tag', async (req, res) => {
  try {
    const distribution = await Message.aggregate([
      {
        $group: {
          _id: '$tag',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: distribution.map(item => ({
        tag: item._id,
        count: item.count
      }))
    });
  } catch (err) {
    console.error('GET /analytics/messages-by-tag error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get messages by channel
 */
router.get('/messages-by-channel', async (req, res) => {
  try {
    const distribution = await Message.aggregate([
      {
        $group: {
          _id: '$channel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: distribution.map(item => ({
        channel: item._id,
        count: item.count
      }))
    });
  } catch (err) {
    console.error('GET /analytics/messages-by-channel error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get messages by priority
 */
router.get('/messages-by-priority', async (req, res) => {
  try {
    const distribution = await Message.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: distribution.map(item => ({
        priority: item._id,
        count: item.count
      }))
    });
  } catch (err) {
    console.error('GET /analytics/messages-by-priority error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get sentiment distribution
 */
router.get('/sentiment-distribution', async (req, res) => {
  try {
    const distribution = await Message.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: distribution.map(item => ({
        sentiment: item._id,
        count: item.count
      }))
    });
  } catch (err) {
    console.error('GET /analytics/sentiment-distribution error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get ticket status distribution
 */
router.get('/ticket-status', async (req, res) => {
  try {
    const distribution = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: distribution.map(item => ({
        status: item._id,
        count: item.count
      }))
    });
  } catch (err) {
    console.error('GET /analytics/ticket-status error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get response time analytics
 */
router.get('/response-times', async (req, res) => {
  try {
    const resolvedTickets = await Ticket.find({ status: 'resolved' })
      .populate('message')
      .limit(100);

    const responseTimes = resolvedTickets
      .filter(t => t.message && t.message.receivedAt && t.updatedAt)
      .map(t => {
        const responseTime = (new Date(t.updatedAt) - new Date(t.message.receivedAt)) / (1000 * 60 * 60);
        return {
          ticketId: t._id,
          responseTimeHours: Math.round(responseTime * 10) / 10
        };
      });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, item) => sum + item.responseTimeHours, 0) / responseTimes.length
      : 0;

    res.json({
      success: true,
      data: {
        averageResponseTimeHours: Math.round(avgResponseTime * 10) / 10,
        samples: responseTimes.slice(0, 10)
      }
    });
  } catch (err) {
    console.error('GET /analytics/response-times error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get recent activity timeline
 */
router.get('/timeline', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const recentMessages = await Message.find()
      .sort({ receivedAt: -1 })
      .limit(limit)
      .select('channel tag priority receivedAt');

    const recentTickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('status createdAt updatedAt');

    res.json({
      success: true,
      data: {
        recentMessages,
        recentTickets
      }
    });
  } catch (err) {
    console.error('GET /analytics/timeline error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;