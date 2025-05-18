const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).max(80).required(),
  phone: Joi.string().pattern(/^\d{10}$/).allow(null),
  positionId: Joi.number().required(),
  password: Joi.string().min(8).required()
});

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.details.map(d => d.message)
    });
  }
  req.validatedData = value;
  next();
};

module.exports = validateUser ;