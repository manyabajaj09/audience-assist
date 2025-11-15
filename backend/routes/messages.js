const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
router.post('/ingest', messagesController.ingest);
router.get('/', messagesController.list);
router.get('/:id', messagesController.detail);
router.post('/suggest-reply', messagesController.suggestReply);
module.exports = router;