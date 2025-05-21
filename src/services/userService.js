const {User} = require('../models'); //Import user model
const { hashPassword } = require('../utils/bcryptHelper'); //Import password hashing utility

//createUser function
const createUser = async (data) => {
    try {
        // Hash password before storing
        const hashedPassword = await hashPassword(data.password);
        const user = User.create({...data,password: hashedPassword});
        return user;
    }catch (error) {
        throw new Error('Error creating user:' + error.message);
    }
};

const getallUsers = async (limit,offset) => {
    try {
        // Create user with hashed password
        const users = await User.findAndCountAll({ 
            include: ['position'],
            limit,
            offset
        });
        return users;
    }catch (error) {
        throw new Error('Error fetching users:' + error.message);
    }
};


const getUserById = async (id) => {
    try {
        const user = await User.findByPk(id, { include: ['position'] }); // Eager load position data
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

        if (data.Password){
            data.Password = await hashPassword(data.Password);
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