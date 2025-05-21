//Importing the authentication service
const authService = require('../services/authService');

//Controller to LogIn a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validate that e-mail and password have been provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        //Authenticates the user and generates token
        const userWithToken = await authService.loginUser(email, password);

        //Returns a successful response with user and token data
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userWithToken
        });

    } catch (error) {
        //Incorrect credentials
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        //Disabled role or position
        if (error.message.includes('Position is inactive')) {
            return res.status(403).json({
                success: false,
                message: 'Your position is currently inactive. Please contact administrator.'
            });
        }

        //Unexpected server error 
        res.status(500).json({
            success: false,
            message: 'Internal server error during login',
            error: error.message
        });
    }
};

//Controller to validate the authentication token
const validateToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        //Verify that the authorization header exists and is in valid format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        //Extracts the token and validates it
        const token = authHeader.substring(7);
        const decoded = await authService.validateToken(token);

        //Returns response with decoded token information
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: decoded
        });

    } catch (error) {
        //Invalid or expired token
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

//Logout Controller
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

//Export of controllers
module.exports = {
    login,
    validateToken,
    logout
};