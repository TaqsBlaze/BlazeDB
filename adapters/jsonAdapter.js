const fs = require('fs').promises;
const path = require('path');
const BaseAdapter = require('./baseAdapter');

class JSONAdapter extends BaseAdapter {
  constructor(dbPath) {
    super();
    this.dbPath = path.join(__dirname, dbPath);
  }

  async get() {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      return jsonData.data || [];
    } catch (err) {
      console.error('Error reading data:', err);
      throw err;
    }
  }

  async insert(newData) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData.data = jsonData.data || [];

      if (!jsonData.length <= 0){
        newData.id = jsonData.data[jsonData.data.length - 1].id + 1 //Auto increment id
      } else {
        newData.id = 1 //Setting default first value id
      }

      jsonData.data.push(newData);
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error writing data:', err);
      throw err;
    }
  }

  async update(id, updatedData) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData.data = (jsonData.data || []).map(item =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error updating data:', err);
      throw err;
    }
  }

  async delete(id) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData.data = (jsonData.data || []).filter(item => item.id !== id);
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error deleting data:', err);
      throw err;
    }
  }

  async createSchema(schema) {

    try {
      const fileContent = await fs.readFile(this.dbPath, 'utf-8');
      dbData = JSON.parse(fileContent);
    } catch (err) {
      // If file doesn't exist, start fresh
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    // Add the new schema to the database object
    if (dbData[schema.name]) {
      throw new Error(`Schema with name '${schema.name}' already exists.`);
    }
    
    try {
      // Validate the schema object
      if (!schema || !schema.name || !schema.properties) {
        throw new Error('Schema must include a name and properties.');
      }
  
      // Format the schema structure
      const formattedSchema = {
        schema: {
          properties: schema.properties
        },
        [schema.name]: [] // Dynamically set the table name with an empty array
      };
  
      // Write the schema to the database file
      await fs.writeFile(this.dbPath, JSON.stringify(formattedSchema, null, 2));
      console.log('Schema created successfully.');

    } catch (err) {
      console.error('Error creating schema:', err.message);
      throw err;
    }
  }
}
  

module.exports = JSONAdapter;
