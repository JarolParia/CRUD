const userService = require('../services/userService');
const { User } = require('../models');

// Controller function to get all positions
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getallUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createUser = async (req,res) =>{
    try {
        const newUser =await userService.createUser(req.body);
        res.status(201).json(newUser);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserById = async (req,res) =>{
    try{
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await userService.updateUserService(id, updateData);

        return res.status(200).json({ message: 'User updated successfully' });
        
    } catch (error) {
        console.error('Error in updateUser controller:', error.message);
        
        if (error.message.includes('User not found')) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser
};