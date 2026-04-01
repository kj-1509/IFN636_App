const User = require('../models/User');
const Thread = require('../models/Thread');
// Get all users (admin only) //
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Delete user (admin only) //
const deleteUser = async (req, res) => {
    try {
        await Thread.deleteMany({ author: req.params.id });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, deleteUser };