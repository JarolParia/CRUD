const {User} = require('../models');


//createUser function
const createUser = async (data) => {
    try {
        const user = await User.create(data);
        return user;
    }catch (error) {
        throw new Error('Error creating user:' + error.message);
    }
};

const getallUsers = async () => {
    try {
        const users = await User.findAll({ include: ['position'] });
        return users;
    }catch (error) {
        throw new Error('Error fetching users:' + error.message);
    }
};


const getUserById = async (id) => {
    try {
        const user = await User.findByPk(id, { include: ['position'] });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }catch (error) {
        throw new Error('Error fetching user:' + error.message);
    }
};


const updateUser = async (id, data) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update(data);
        return user;
    }catch (error) {
        throw new Error('Error updating user:' + error.message);
    }
};

const deleteUser = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
        return user;
    }catch (error) {
        throw new Error('Error deleting user:' + error.message);
    }
};

module.exports = {
    createUser,
    getallUsers,
    getUserById,
    updateUser,
    deleteUser 
};