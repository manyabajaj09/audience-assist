const Message = require('../models/Message');
const Ticket = require('../models/Ticket');
const { classifyMessage, suggestReply } = require('../utils/openaiClient');

/**
 * Ingest a new message
 */
exports.ingest = async (req, res) => {
  try {
    const { channel = 'manual', sender, content, externalId } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    // Create message
    const msg = new Message({
      channel,
      sender: sender || 'unknown',
      content,
      externalId,
    });

    await msg.save();

    // Classify using OpenAI
    const classification = await classifyMessage(content);
    if (classification) {
      msg.tag = classification.tag || msg.tag;
      msg.sentiment = classification.sentiment || msg.sentiment;
      msg.priority = classification.priority || msg.priority;
      await msg.save();
    }

    // Auto-create ticket if high priority
    if (msg.priority >= 4) {
      const ticket = new Ticket({
        title: content.slice(0, 80),
        message: msg._id,
        status: 'open',
      });
      await ticket.save();
    }

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error('INGEST ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


/**
 * List messages (filter optional)
 */
exports.list = async (req, res) => {
  try {
    const { tag, priority } = req.query;
    const filter = {};

    if (tag) filter.tag = tag;
    if (priority) filter.priority = Number(priority);

    const messages = await Message.find(filter)
      .sort({ receivedAt: -1 })
      .limit(200);

    res.json({ success: true, messages });
  } catch (err) {
    console.error('LIST ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


/**
 * Get message detail
 */
exports.detail = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error('DETAIL ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


/**
 * AI auto-suggest reply
 */
exports.suggestReply = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const reply = await suggestReply(content);

    res.json({ success: true, reply });
  } catch (err) {
    console.error('SUGGEST REPLY ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
