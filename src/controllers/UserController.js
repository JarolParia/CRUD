//Import of dependencies

//Service containing business logic for user operations
const userService = require('../services/userService');

//Data model for users (imported but not used directly in the controller)
const { User } = require('../models');

// Controller function for determining all positions
const getAllUsers = async (req, res) => {
    
    //Extract paging parameter from query string with default values
    const page = parseInt(req.query.page) || 1; //current page (defaul 1)
    const limit = parseInt (req.query.limit) || 10; // Limit per page (defaul 10)
    const offset = (page - 1) * limit; //Displacement calculation

    try {
        //Get service users with paging
        const { count, rows } = await userService.getallUsers(limit, offset);
        
        //Get service users with paging
        res.status(200).json({
            totalItems: count, //Total users in the database
            totalPages: Math.ceil(count / limit), //Total pages available
            currentPage: page, //Current page
            users: rows //Array of users of the current page
        });
    } catch (error) {
        //Server error handling
        res.status(500).json({ message: error.message });
    }
};

//Function to create a new user in the system
const createUser = async (req,res) =>{
    try {
        //Delegate the creation to the service and reply with the new user
        const newUser =await userService.createUser(req.body);
        res.status(201).json(newUser); 
    }catch (error) {
        //Error handling (validation, duplicates, etc.)
        res.status(500).json({message: error.message});
    }
};


//Function that retrieves a specific user by ID
const getUserById = async (req,res) =>{
    try{
        //Obtain user by Id through the service
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        //Special handling for user not found
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        //Other server errors
        res.status(500).json({ message: error.message });
    }
};

//Function to update the data of an existing user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; //Extract IDs from route parameters
        const updateData = req.body; //Data to update

        //Basic ID validation
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        //Delegate the update to the service
        await userService.updateUser(id, updateData);

        //Successful response
        return res.status(200).json({ message: 'User updated successfully' });
        
    } catch (error) {
        console.error('Error in updateUser controller:', error.message);
        
        //Specific handling for user not found
        if (error.message.includes('User not found')) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        //Generic server error
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message //Details of the error
        });
    }
};

//Function to delete a user
const userDelete = async (req, res) => {
    try {
        const { id } = req.params; //Extract ID from URL parameters 
        
        //Call the service to delete the user
        const deletedUser = await userService.deleteUser(id);
        
        //Successful response with deleted user data
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
        
    } catch (error) {
        //User-specific handling not found 
        if (error.message.includes('User not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        // General server error
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while deleting user'
        });
    }
};

//Export all controller functions
module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    userDelete
};