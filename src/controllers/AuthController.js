const authService = require('../services/authService');

// Controller para login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Realizar login
        const userWithToken = await authService.loginUser(email, password);

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userWithToken
        });

    } catch (error) {
        // Manejo de errores específicos
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (error.message.includes('Position is inactive')) {
            return res.status(403).json({
                success: false,
                message: 'Your position is currently inactive. Please contact administrator.'
            });
        }

        // Error general
        res.status(500).json({
            success: false,
            message: 'Internal server error during login',
            error: error.message
        });
    }
};

// Controller para validar token
const validateToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.substring(7);
        const decoded = await authService.validateToken(token);

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: decoded
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

// Controller para logout
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

module.exports = {
    login,
    validateToken,
    logout
};