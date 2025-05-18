const Joi = require('joi');

// Schema para validar login
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(1).required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

// Middleware para validar datos de login
const validateLoginMiddleware = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: error.details.map(d => d.message)
        });
    }
    
    req.validatedData = value;
    next();
};

module.exports = {
    validateLoginMiddleware
};