function sanitizeInput(model, inputData) {


  const sanitizedData = {};
  const fields = model.properties || model.fields;

  for (const [field, rules] of Object.entries(fields)) {
    const value = inputData[field];

    // Check for required fields
    if (rules.required && (value === undefined || value === null)) {
      throw new Error(`Field '${field}' is required.`);
    }

    // Skip undefined optional fields
    if (value === undefined) continue;

    // Type check
    if (typeof value !== rules.type) {
      throw new Error(`Field '${field}' must be of type '${rules.type}'.`);
    }

    // Sanitize strings to remove special characters
    let sanitizedValue = value;

    if (typeof value === 'string') {
        // Always remove HTML tags first
        sanitizedValue = sanitizedValue.replace(/<\/?[^>]+(>|$)/g, '');

        if (field === 'email') {
            // Email-specific sanitization: Keep only alphanumeric, '.', and '@'
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9.@]/g, '');
        } else {
            // General string sanitization: Remove special characters except spaces
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s]/g, '');
        }
    }


    // Additional constraints
    if (rules.maxLength !== undefined && sanitizedValue.length > rules.maxLength) {
      throw new Error(`Field '${field}' exceeds maximum length of ${rules.maxLength}.`);
    }
    if (rules.min !== undefined && sanitizedValue < rules.min) {
      throw new Error(`Field '${field}' cannot be less than ${rules.min}.`);
    }
    if (rules.max !== undefined && sanitizedValue > rules.max) {
      throw new Error(`Field '${field}' cannot be greater than ${rules.max}.`);
    }

    // Add sanitized value to the result
    sanitizedData[field] = sanitizedValue;
  }

  return sanitizedData;
}

module.exports = { sanitizeInput };
