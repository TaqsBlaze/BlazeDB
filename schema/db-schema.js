const BlazeDB = require("../blazedb");

class BlazeDBSchema {
    constructor(BlazeDB) {
      this.BlazeDB = BlazeDB;
      this.models = [];
      this.properties = {};
    }
  
    addModel(model) {
      this.models.push(model);
    }
  
    async createSchema() {
      const schema = {};
      schema['properties'] = {};
  
      // Create the root object
      schema.$schema = 'http://json-schema.org/draft-07/schema#';
      schema.type = 'object';
  
      // Add fields to the schema
      this.models.forEach((model) => {
        Object.keys(model.fields).forEach((field) => {
          const fieldType = model.fields[field].type;
          if (fieldType === 'string') {
            schema.properties[field] = { type: 'string' };
          } else if (fieldType === 'number') {
            schema.properties[field] = { type: 'integer' };
          } else if (fieldType === 'boolean') {
            schema.properties[field] = { type: 'boolean' };
          }
        });
      });
  
      // Add required fields to the schema
      this.models.forEach((model) => {
        Object.keys(model.fields).forEach((field) => {
          if (model.fields[field].required) {
            schema.required = [field];
          }
        });
      });
  
      // Write the schema to the database
      await this.BlazeDB.createSchema(schema);
    }
  }
  
  module.exports = BlazeDBSchema;