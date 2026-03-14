export const validateZod = (schema) => {
  return (req, res, next) => {
    try {
      console.log('🔍 Zod Validation - Request body:', req.body);
      console.log('🔍 Content-Type:', req.headers['content-type']);
      
      // Parse and validate with Zod
      const validatedData = schema.parse(req.body);
      
      console.log('✅ Validation passed');
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      next();
    } catch (error) {
      console.error('❌ Zod Validation Error:', error);
      
      // Format Zod errors nicely
      const errors = error.errors?.map(err => ({
        path: err.path.join('.'),
        message: err.message
      })) || error.message;
      
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }
  };
};
