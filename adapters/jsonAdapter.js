const fs = require('fs').promises;
const path = require('path');
const BaseAdapter = require('./baseAdapter');
const { sanitizeInput }  = require("../utility/sanitizer");
class JSONAdapter extends BaseAdapter {
  constructor(dbpath) {
    super();
    this.dbPath = dbpath;
  }

  async get(tableName) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      return jsonData["schema"][tableName] || [];
    } catch (err) {
      console.error('Error reading data:', err);
      throw err;
    }
  }

  async insert(tableName, newData) {

  try {
    // Read the database file
    const dbData = await fs.readFile(this.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);

    // Check if the table exists
    if (!jsonData["schema"][tableName]) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    // Set the default data array if it doesn't exist
    const tableData = jsonData['schema'][tableName];

    // Auto-increment the id or set default id
    if (!tableData.length <= 0) {
      newData.id = tableData[tableData.length - 1].id + 1; // Auto-increment id
    } else {
      newData.id = 1; // Set default id
    }

    // sanitize data
    console.log('>>>>', jsonData);
    console.log('>>> INCOMIUNG:',newData);
    const cleanData = sanitizeInput(jsonData.schema, newData)
    console.log('>>> Clean:', cleanData);
    // Add the new data to the table
    jsonData['schema'][tableName].push(cleanData);

    // Write the updated data back to the file
    await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    console.log(`Data successfully inserted into '${tableName}' table.`);
  } catch (err) {
    console.error('Error writing data:', err);
    throw err;
  }
}


  async update(tableName, id, updatedData) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData["schema"][tableName] = (jsonData["schema"][tableName] || []).map(item =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error updating data:', err);
      throw err;
    }
  }

  async delete(tableName, id) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData["schema"][tableName] = (jsonData["schema"][tableName] || []).filter(item => item.id !== id);
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error deleting data:', err);
      throw err;
    }
  }

  async createSchema(schema) {

    try {
      const formattedSchema = {
        properties: schema.properties || {},
        [schema.tableName]: []
      };
      await fs.writeFile(this.dbPath, JSON.stringify({ schema: formattedSchema}, null, 2));
      console.log('Schema created successfully.');
    } catch (err) {
      console.error('Error creating schema:', err);
      throw err;
    }
  }
}

module.exports = JSONAdapter;
