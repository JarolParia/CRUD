//Import of the service that manages the positions
const positionService = require('../services/positionService');

//Controller to obtain all positions with paging
const getAllPositions = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; 

    try {
        //Obtains the positions with pagination from the service
        const { count, rows } = await positionService.getallPositions(limit,offset);
        
        //Response with paging metadata
        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            positions: rows
        });
    } catch (error) {
        //Error al obtener las posiciones
        res.status(500).json({ message: error.message });
    }
};

//Controller to get all positions without paging
const getAllPositionsAll = async (req, res) => {
    try {
        //Obtains all active and deactivated positions without filters
        const positions = await positionService.getallPositionsAll();
        res.status(200).json({
            success:true,
            data: positions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Controller to create a new position
const createPosition = async (req,res) =>{
    try {
        //Validates that the name of the position has been provided
        if (!req.body.positionName) {
            return res.status(400).json({ message: 'PositionName is required' });
        }

        //Create the position using the service
        const newPosition =await positionService.createPosition(req.body);
        
        //Returns the position created with code 201
        res.status(201).json(newPosition);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Controller to obtain a specific position by ID
const getPositionById = async (req,res) =>{
    try{
        const position = await positionService.getPositionById(req.params.id);
        res.status(200).json(position)
    }catch(error){
        //Position not found
        if (error.message === 'Position not found'){
            return res.status(404).json({message: error.message})
        }
        //Another error
        res.status(500).json({message: error.message})
    }
};

//Controller to delete an item by its ID
const deletePositionHandler = async (req, res) => {
    try {
        const { id } = req.params;
        //Eliminates the position
        const result = await positionService.deletePosition(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

//Controller for updating an existing position
const updatePosition = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { positionName, status } = req.body;

        //Verify that at least one of the fields is provided. 
        if (!positionName && status === undefined) {
            return res.status(400).json({ message: 'At least one field (positionName or status) is required' });
        }
        
        //Update position
        const updateData = {};
        if (positionName) updateData.positionName = positionName;
        if (status !== undefined) updateData.status = status;

        const updatedPosition = await positionService.updatePosition(id, updateData);
        
        res.status(200).json(updatedPosition);
    } catch (error) {

        //Position not found
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }

        //Another error
        res.status(500).json({ message: error.message });
    }
}

//Exporting controllers for use in routes
module.exports = {
    createPosition,
    getPositionById,
    getAllPositions,
    deletePositionHandler,
    updatePosition,
    getAllPositionsAll
};