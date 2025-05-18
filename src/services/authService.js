const { User, Position } = require('../models');
const { comparePassword } = require('../utils/bcryptHelper');
const { generateToken } = require('../utils/jwtHelper');

// Servicio de login
const loginUser = async (email, password) => {
    try {
        // Buscar usuario con su posición incluida
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['positionId', 'positionName', 'status']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verificar si la posición está activa
        if (!user.position.status) {
            throw new Error('Position is inactive');
        }

        // Verificar contraseña
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Crear payload para el token
        const tokenPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            position: {
                id: user.position.positionId,
                name: user.position.positionName
            }
        };

        // Generar token
        const token = generateToken(tokenPayload);

        // Retornar usuario sin la contraseña y con el token
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            phone: user.phone,
            position: user.position,
            token
        };

        return userResponse;

    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
};

// Servicio para validar token y obtener usuario
const validateToken = async (token) => {
    try {
        const { verifyToken } = require('../utils/jwtHelper');
        const decoded = verifyToken(token);
        
        // Opcional: verificar que el usuario aún existe en la base de datos
        const user = await User.findByPk(decoded.id, {
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['positionId', 'positionName', 'status']
                }
            ]
        });

        if (!user || !user.position.status) {
            throw new Error('User not found or position inactive');
        }

        return decoded;
    } catch (error) {
        throw new Error('Token validation failed: ' + error.message);
    }
};

module.exports = {
    loginUser,
    validateToken
};