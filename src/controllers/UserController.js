const userService = require('../services/userService');
const { User } = require('../models');

// Controller function to get all positions
const getAllUsers = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt (req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await userService.getallUsers(limit, offset);
        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            users: rows
        });
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

        await userService.updateUser(id, updateData);

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

const userDelete = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
        
        // Llamar al servicio deleteUser
        const deletedUser = await userService.deleteUser(id);
        
        // Responder con el usuario eliminado
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
        
    } catch (error) {
        // Manejar diferentes tipos de errores
        if (error.message.includes('User not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        // Error general del servidor
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while deleting user'
        });
    }
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    userDelete
};