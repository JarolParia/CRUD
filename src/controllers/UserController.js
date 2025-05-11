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


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};


module.exports = {
    createUser,
    getUserById,
    deleteUser,
    getAllUsers
};