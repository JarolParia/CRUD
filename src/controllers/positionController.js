const positionService = require('../services/positionService');

const createPosition = async (req,res) =>{
    try {

        if (!req.body.PositionName) {
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


module.exports = {
    createPosition,
    getPositionById
};