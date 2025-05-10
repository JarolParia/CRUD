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


module.exports = {
    getAllPositions,
};