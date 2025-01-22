const Joi = require('joi');

// User related schemas
const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    }),
    
  role: Joi.string()
    .valid('user', 'admin')
    .default('user')
});

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    })
});

// Resource related schemas
const resourceSchema = Joi.object({
  resourceType: Joi.string()
    .required()
    .valid('DONATION', 'VOLUNTEER', 'BENEFICIARY')
    .uppercase(),
    
  name: Joi.string()
    .required()
    .max(100)
    .trim(),
    
  description: Joi.string()
    .required()
    .max(500),
    
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED')
    .default('PENDING')
    .uppercase(),
    
  quantity: Joi.number()
    .min(0)
    .default(1),
    
  category: Joi.string()
    .required()
    .valid('FOOD', 'CLOTHING', 'EDUCATION', 'HEALTHCARE', 'SHELTER', 'OTHER')
    .uppercase(),
    
  location: Joi.string()
    .required(),
    
  contactInfo: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    phone: Joi.string()
      .required()
      .pattern(/^[0-9]{10}$/)
  }).required(),
    
  value: Joi.number()
    .min(0)
    .optional(),
    
  availabilityDate: Joi.date()
    .default(Date.now)
});

const updateResourceSchema = resourceSchema.fork(
  ['resourceType', 'name', 'description', 'category', 'location', 'contactInfo'],
  (schema) => schema.optional()
);

module.exports = {
  registerSchema,
  loginSchema,
  resourceSchema,
  updateResourceSchema
};