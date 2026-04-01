const express = require('express');
const router = express.Router();
const { createThread, getThreads, getThread, updateThread, deleteThread } = require('../controllers/threadController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, createThread);
router.get('/', getThreads);
router.get('/:id', getThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);

module.exports = router;