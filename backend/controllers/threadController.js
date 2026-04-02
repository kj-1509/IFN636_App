const Thread = require('../models/Thread');
// Create thread //
const createThread = async (req, res) => {
    const { title, content, topic } = req.body;
    try {
        const thread = await Thread.create({ title, content, topic, author: req.user.id });
        res.status(201).json(thread);
    } catch (error) {
        res.status(400).json({ error: error.message });
     }
};
// Get all threads //
const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('author', 'name') .sort({ createdAt: -1 });
        res.json(threads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get 1 thread //
const getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id).populate('author', 'name').populate('comments.author', 'name');
        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        return res.json(thread);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update thread //
const updateThread = async (req, res) => {
    const { title, content, topic } = req.body;
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ error: 'Thread not found' });
        if (thread.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        thread.title = title || thread.title;
        thread.content = content || thread.content;
        thread.topic = topic || thread.topic;
        
        await thread.save();
        res.json(thread);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete thread //
const deleteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ error: 'Thread not found' });
        if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await thread.deleteOne();
        res.json({ message: 'Thread deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createThread, getThreads, getThread, updateThread, deleteThread };