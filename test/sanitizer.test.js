const { sanitizeInput } = require('../utils/sanitizer');

describe('sanitizeInput', () => {
    const userModel = {
        name:'User',
        fields: {
            id: { type: 'number', required: true },
            name: { type: 'string', required: true },
            age: { type: 'number', required: false, min: 0, max: 120 },
            email: { type: 'string', required: false, maxLength: 50 },
        }
    };

    test('should sanitize input data and remove special characters', () => {
        const inputData = {
            id: 1,
            name: '<b>John Doe!@#$</b>',
            age: 30,
            email: 'john.doe@example.com<script>'
        };

        const sanitizedData = sanitizeInput(userModel, inputData);
        console.log("<<<<SANI>>>>", sanitizedData)
        expect(sanitizedData).toEqual({
            id: 1,
            name: 'John Doe',
            age: 30,
            email: 'john.doe@example.com'
        });
    });

    test('should throw an error for missing required fields', () => {
        const inputData = {
            name: 'John Doe'
        };

        expect(() => sanitizeInput(userModel, inputData))
            .toThrow("Field 'id' is required.");
    });

    test('should skip undefined optional fields', () => {
        const inputData = {
            id: 1,
            name: 'John Doe'
        };

        const sanitizedData = sanitizeInput(userModel, inputData);

        expect(sanitizedData).toEqual({
            id: 1,
            name: 'John Doe'
        });
    });

    test('should throw an error for invalid types', () => {
        const inputData = {
            id: '1', // Invalid type
            name: 'John Doe',
            age: 'thirty' // Invalid type
        };

        expect(() => sanitizeInput(userModel, inputData))
            .toThrow("Field 'id' must be of type 'number'.");
    });

    test('should throw an error if a string exceeds maxLength', () => {
        const inputData = {
            id: 1,
            name: 'John Doe',
            email: 'a'.repeat(51) // Exceeds maxLength of 50
        };

        expect(() => sanitizeInput(userModel, inputData))
            .toThrow("Field 'email' exceeds maximum length of 50.");
    });

    test('should throw an error if a number is out of range', () => {
        const inputData = {
            id: 1,
            name: 'John Doe',
            age: 150 // Exceeds max
        };

        expect(() => sanitizeInput(userModel, inputData))
            .toThrow("Field 'age' cannot be greater than 120.");
    });

    test('should allow numbers at the minimum boundary', () => {
        const inputData = {
            id: 1,
            name: 'John Doe',
            age: 0
        };

        const sanitizedData = sanitizeInput(userModel, inputData);

        expect(sanitizedData).toEqual({
            id: 1,
            name: 'John Doe',
            age: 0
        });
    });

    test('should remove all special characters from strings', () => {
        const inputData = {
            id: 1,
            name: 'Hello!@#$%^&*()_+<>',
            email: '<script>alert("test")</script>'
        };

        const sanitizedData = sanitizeInput(userModel, inputData);

        expect(sanitizedData).toEqual({
            id: 1,
            name: 'Hello',
            email: 'alerttest'
        });
    });
});
