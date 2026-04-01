const express = require('express');
const { createThread, getThreads, getThread, updateThread, deleteThread } = require('../controllers/threadController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createThread);
router.get('/', getThreads);
router.get('/:id', getThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);

module.exports = router;