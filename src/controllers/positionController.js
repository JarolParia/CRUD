const positionService = require('../services/positionService');

const getAllPositions = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; 

    try {
        const { count, rows } = await positionService.getallPositions(limit,offset);
        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            positions: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllPositionsAll = async (req, res) => {
    try {
        const positions = await positionService.getallPositionsAll();
        res.status(200).json({
            success:true,
            data: positions
        });
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

const deletePositionHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await positionService.deletePosition(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

const updatePosition = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { positionName, status } = req.body;

        if (!positionName && status === undefined) {
            return res.status(400).json({ message: 'At least one field (positionName or status) is required' });
        }
        
        const updateData = {};
        if (positionName) updateData.positionName = positionName;
        if (status !== undefined) updateData.status = status;

        const updatedPosition = await positionService.updatePosition(id, updateData);
        
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
    deletePositionHandler,
    updatePosition,
    getAllPositionsAll
};