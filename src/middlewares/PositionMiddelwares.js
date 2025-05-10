const Joi = require('joi');

const positionSchema = Joi.object({
  positionName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'El nombre del puesto es obligatorio',
    'string.min': 'El nombre debe tener al menos 1 carácter',
    'string.max': 'El nombre no puede exceder 50 caracteres'
  }),
  status: Joi.boolean().default(true)
});

const validatePosition = (req, res, next) => {
  const { error, value } = positionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.details.map(d => d.message)
    });
  }
  req.validatedData = value; // Datos validados se pasan al controlador
  next(); // Continúa hacia el controlador
};

module.exports = validatePosition;