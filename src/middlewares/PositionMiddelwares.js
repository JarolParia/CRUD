const Joi = require('joi');

const positionSchema = Joi.object({
  positionName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'The name of the position is required',
    'string.min': 'The name of the position must be at least 1 character',
    'string.max': 'The name cannot exceed 50 characters'
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
  req.validatedData = value; 
  next(); 
};

module.exports = validatePosition;