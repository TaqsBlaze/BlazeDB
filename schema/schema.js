const BlazeDB = require("../flamedb"); // Consider removing if using dependency injection

class BlazeDBSchema {
    constructor(flameDBInstance) {
        this.BlazeDB = flameDBInstance;
        this.models = [];
    }

    addModel(model) {
        this.models.push(model);
    }

    async createSchema() {
        this.models.forEach(async (model) => {
            const schema = {
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'object',
                properties: {},
                required: []
            };

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

                if (model.fields?.[field]?.required) {
                    if (!schema.required.includes(field)) {
                        schema.required.push(field);
                    }
                }
            });

            await this.BlazeDB.createSchema({ tableName: model.name, ...schema });
        });
    }
}

module.exports = BlazeDBSchema;
