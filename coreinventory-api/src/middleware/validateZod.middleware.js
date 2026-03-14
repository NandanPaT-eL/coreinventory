import { ZodError } from 'zod';

/**
 * Validate request data against Zod schema
 * @param {Object} schema - Zod schema object with body, query, params
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request parts against schema
      if (schema.body) {
        // Validate but don't reassign - just check validity
        schema.body.parse(req.body);
      }
      if (schema.query) {
        // Parse query params (they come as strings)
        const parsedQuery = schema.query.parse(req.query);
        // Copy parsed values back to req.query (but don't reassign the object)
        Object.keys(parsedQuery).forEach(key => {
          req.query[key] = parsedQuery[key];
        });
      }
      if (schema.params) {
        // Validate but don't reassign
        schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

export default validate;
