const positionService = require('../services/positionService');

// Controller function to get all positions
const getAllPositions = async (req, res) => {
    try {
        const positions = await positionService.getallPositions();
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPosition = async (req,res) =>{
    try {

        if (!req.body.positionName) {
            return res.status(400).json({ message: 'PositionName is required' });
        }

        const newPosition =await positionService.createPosition(req.body);
        res.status(201).json(newPosition);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPositionById = async (req,res) =>{
    try{
        const position = await positionService.getPositionById(req.params.id);
        res.status(200).json(position)
    }catch(error){
        if (error.message === 'Position not found'){
            return res.status(404).json({message: error.message})
        }
        res.status(500).json({message: error.message})
    }
};


const updatePosition = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { positionName } = req.body;

        if (!positionName) {
            return res.status(400).json({ message: 'positionName is required' });
        }

        const updatedPosition = await positionService.updatePosition(id, { positionName });
        
        res.status(200).json(updatedPosition);
    } catch (error) {

        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPosition,
    getPositionById,
    getAllPositions,
    updatePosition
};