const{Position} = require('../models');

// get all positions
const getallPositions = async () => {
    try {
        const positions = await Position.findAll();
        return positions;
    }catch (error) {
        throw new Error('Error fetching positions:' + error.message);
    }
};

// get position by id
const getPositionById = async (id) => {
    try {
        const position = await Position.findByPk(id);
        if (!position) {
            throw new Error('Position not found');
        }
        return position;
    } catch (error) {
        throw new Error('Error fetching position: ' + error.message);
    }
};

// createPosition function
const createPosition = async (data) => {
    try {
        const position = await Position.create({ 
            positionName: data.positionName, // <- Usa el nombre exacto del modelo
            status: data.status || true     // Campo opcional con valor por defecto
        });
        return position;
    } catch (error) {
        throw new Error('Error creating position: ' + error.message);
    }
};

// updatePosition function
const updatePosition = async (id, data) => {
    try {
        const position = await Position.findByPk(id);
        if (!position) {
            throw new Error('Position not found');
        }
        await position.update(data);
        return position;
    } catch (error) {
        throw new Error('Error updating position: ' + error.message);
    }
};

// deletePosition function
const deletePosition = async (id) => {
    try {
        const position = await Position.findByPk(id);
        if (!position) {
            throw new Error('Position not found');
        }
        await position.destroy();
        return position;
    } catch (error) {
        throw new Error('Error deleting position: ' + error.message);
    }
}

module.exports = {
    getallPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition
};