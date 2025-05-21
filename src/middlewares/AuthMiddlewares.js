//Import of dependencies

//Helper function for verifying and decoding JWT tokens
const { verifyToken } = require('../utils/HelperJwt');

// Middleware to verify if the user is authenticated
const authenticateToken = async (req, res, next) => {
    try {
        //Extract the authorization header
        const authHeader = req.headers.authorization;

        //Verify if the token exists and has the correct format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        //Extract the deleted token from the header
        const token = authHeader.substring(7);
        
        //Verify and decode the token
        const decoded = verifyToken(token);

        //Add decoded user information to the request
        req.user = decoded;
        
        //Move to the next middleware
        next();

    } catch (error) {
        //Handling token errors (invalid/expired)
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

// Middleware to verify if the user has an administrator role
const requireAdmin = (req, res, next) => {
    //Verify if the user is authenticated
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    //Check if the user's role is Admin
    if (req.user.position.name.toLowerCase() !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

// Middleware to verify whether the user is admin or supervisor
const requireAdminOrSupervisor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    //Get user role in lowercase for comparison
    const position = req.user.position.name.toLowerCase();
    
    //Check if the role is Admin or supervisor
    if (position !== 'admin' && position !== 'supervisor') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin or Supervisor privileges required.'
        });
    }

    next();
};

// Middleware to verify specific roles
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        //Get user role and allowed roles (both in lower case)
        const userRole = req.user.position.name.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());

        //Check if the user's role is in the allowed list
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

// Middleware to verify that the user only accesses his own data or is Admin.
const requireSelfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    //Obtain user role and relevant IDs
    const userRole = req.user.position.name.toLowerCase();
    const userId = parseInt(req.params.id); //ID of the requested resource
    const currentUserId = req.user.id; //Authenticated user ID

    //Allow full access to administrators 
    if (userRole === 'admin') {
        return next();
    }

    //Verify if the user accesses his own data 
    if (userId !== currentUserId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own data.'
        });
    }

    next();
};

//Export all middleware
module.exports = {
    authenticateToken,
    requireAdmin,
    requireAdminOrSupervisor,
    requireRole,
    requireSelfOrAdmin
};