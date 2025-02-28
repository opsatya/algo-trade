import express from 'express';
const { sendMessage } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Chat route
router.post('/message', protect, sendMessage);

module.exports = router;