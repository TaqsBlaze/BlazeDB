const BlazeDB = require("../blazedb"); // Consider removing if using dependency injection

class BlazeDBSchema {
    constructor(blazeDBInstance) {
        this.BlazeDB = blazeDBInstance;
        this.models = [];
        this.properties = {};
    }

    addModel(model) {
        this.models.push(model);
    }

    async createSchema() {
        const schema = {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {},
            required: [] // Initialize with an empty array
        };

        // Add fields to the schema
        this.models.forEach((model) => {
            Object.keys(model.fields).forEach((field) => {
                const fieldType = model.fields[field].type;
                const fieldSchema = {};

                if (fieldType === 'string') {
                    fieldSchema.type = 'string';
                } else if (fieldType === 'number') {
                    fieldSchema.type = 'integer';
                } else if (fieldType === 'boolean') {
                    fieldSchema.type = 'boolean';
                }

                schema.properties[field] = fieldSchema;

                // Collect required fields
                if (model.fields[field].required) {
                    if (!schema.required.includes(field)) {
                        schema.required.push(field);
                    }
                }
            });
        });

        // Write the schema to the database
        await this.BlazeDB.createSchema(schema);
    }
}

module.exports = BlazeDBSchema;
