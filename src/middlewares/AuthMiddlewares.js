const { verifyToken } = require('../utils/HelperJwt');

// Middleware para verificar si el usuario está autenticado
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        // Agregar información del usuario decodificada al request
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

// Middleware para verificar si el usuario es admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.position.name.toLowerCase() !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

// Middleware para verificar si el usuario es admin o supervisor
const requireAdminOrSupervisor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const position = req.user.position.name.toLowerCase();
    if (position !== 'admin' && position !== 'supervisor') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin or Supervisor privileges required.'
        });
    }

    next();
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.position.name.toLowerCase();
        const allowedRoles = roles.map(role => role.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

// Middleware para verificar que el usuario solo acceda a sus propios datos
const requireSelfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const userRole = req.user.position.name.toLowerCase();
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    // Admins pueden acceder a cualquier usuario
    if (userRole === 'admin') {
        return next();
    }

    // Los usuarios solo pueden acceder a sus propios datos
    if (userId !== currentUserId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own data.'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireAdminOrSupervisor,
    requireRole,
    requireSelfOrAdmin
};