const { sequelize, Position, User } = require('../models');

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

        if (data.positionName) {
            const existingPosition = await Position.findOne({ 
                where: { positionName: data.positionName } 
            });
            if (existingPosition && existingPosition.id !== parseInt(id)) {
                throw new Error('Position name already exists');
            }
        }

        await position.update(data);
        return position;
    } catch (error) {
        throw new Error('Error updating position: ' + error.message);
    }
};

// deletePosition function
const deletePosition = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        // Verificar si existe la posición
        const position = await Position.findByPk(id, { transaction });
        if (!position) {
            throw new Error('Position not found');
        }

        // Verificar si hay usuarios asociados
        const usersCount = await User.count({ 
            where: { PositionId: id },
            transaction
        });

        if (usersCount > 0) {
            throw new Error('Cannot delete position with associated users');
        }

        // Eliminar la posición
        await position.destroy({ transaction });
        await transaction.commit();
        
        return { success: true, message: 'Position deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getallPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition
};