const fs = require('fs').promises;
const path = require('path');
const BaseAdapter = require('./base-adapter');

class JSONAdapter extends BaseAdapter {
  constructor() {
    super();
    this.dbPath = path.join(__dirname, '../db.json');
  }

  async getData() {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      return jsonData.data || [];
    } catch (err) {
      console.error('Error reading data:', err);
      throw err;
    }
  }

  async setData(newData) {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      jsonData.data = jsonData.data || [];
      jsonData.data.push(newData);
      await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error writing data:', err);
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

  async createSchema(schema) {
    try {
      const formattedSchema = {
        properties: schema.properties || {}
      };
      await fs.writeFile(this.dbPath, JSON.stringify({ schema: formattedSchema, data: [] }, null, 2));
      console.log('Schema created successfully.');
    } catch (err) {
      console.error('Error creating schema:', err);
      throw err;
    }
  }
}

module.exports = JSONAdapter;
