const { User, Position } = require('../models');
const { comparePassword } = require('../utils/bcryptHelper');
const { generateToken, verifyToken } = require('../utils/HelperJwt');

// Servicio de login
const loginUser = async (email, password) => {
    try {
        // Find user with associated position data
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
                exclude: ['createdAt', 'updatedAt'] //Exclude sensitive/unnecessary fields
            }
        });

        // Validate user exists
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if user's position is active
        if (!user.position.status) {
            throw new Error('Position is inactive');
        }

        // Verify password matches hashed version
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Prepare token payload (contains essential user data)
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

        // Generate JWT with 1 hour expiration
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

        // Return sanitized user data with token
        return userResponse;

    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
};

// Servicio para validar token y obtener usuario
const validateToken = async (token) => {
    try {
        const decoded = verifyToken(token);
        
        // Verify user still exists in database
        const user = await User.findByPk(decoded.id, {
            include: [
                {
                    model: Position,
                    as: 'position',
                    attributes: ['positionId', 'positionName', 'status']
                }
            ]
        });

        // Check user and position status
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