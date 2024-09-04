const fs = require('fs').promises;
const path = require('path');

class BlazeDB {
  constructor() {
    this.dbPath = path.join(__dirname, 'db.json');
  }

  async getData() {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      console.log(jsonData.data);
      return jsonData.data || []; // Ensure data exists and return an empty array if not
    } catch (err) {
      console.error('Error reading data:', err);
      throw err;
    }
  }

  async setData(newData) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData.data = jsonData.data || []; // Ensure data array exists
      jsonData.data.push(newData);
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error writing data:', err);
      throw err;
    }
  }

  async deleteData(id) {
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

  async updateData(id, updatedData) {
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

  async createSchema(schema) {
    try {
      // Check if the file already exists
      try {
        await fs.access(this.dbPath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          // If file does not exist, initialize it with the schema and empty data
          await fs.writeFile(this.dbPath, JSON.stringify({ schema: schema, data: [] }, null, 2));
        } else {
          throw err;
        }
      }
      console.log('Schema created successfully.');
    } catch (err) {
      console.error('Error creating schema:', err);
      throw err;
    }
  }
}

module.exports = BlazeDB;
