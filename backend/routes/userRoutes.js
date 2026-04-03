const express = require('express');
const { createThread, getThreads, getThread, updateThread, deleteThread } = require('../controllers/threadController');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { protect,adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createThread);
router.get('/', getThreads);
router.get('/:id', getThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);
router.get('/', protect, adminOnly, getAllUsers,);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;