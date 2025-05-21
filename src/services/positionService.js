const { sequelize, Position, User } = require('../models'); //Import database models and sequelize instance

// get all positions
const getallPositions = async (limit,offset) => {
    try {
        const positions = await Position.findAndCountAll({
            limit,
            offset
        });
        return positions;
    }catch (error) {
        throw new Error('Error fetching positions:' + error.message);
    }
};

// get all positions
const getallPositionsAll = async () => {
    try {
        const positions = await Position.findAll({
            where: {status: true}, //Only active positions
            attributes: ['positionId', 'positionName','status'], // Selected fields
        });
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
            positionName: data.positionName, 
            status: data.status || true     
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
        
        const position = await Position.findByPk(id, { transaction });
        if (!position) {
            throw new Error('Position not found');
        }

        
        const usersCount = await User.count({ 
            where: { PositionId: id },
            transaction
        });

        if (usersCount > 0) {
            throw new Error('Cannot delete position with associated users');
        }

        
        await position.destroy({ transaction });
        await transaction.commit(); // Commit transaction if successful
        
        return { success: true, message: 'Position deleted successfully' };
    } catch (error) {
        await transaction.rollback(); // Rollback on error
        throw error;
    }
};

module.exports = {
    getallPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition,
    getallPositionsAll
};