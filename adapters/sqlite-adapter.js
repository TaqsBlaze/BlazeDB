// adapters/sqlite-adapter.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const BaseAdapter = require('./base-adapter');

class SQLiteAdapter extends BaseAdapter {
  constructor(dbPath = './blaze.db') {
    super();
    this.dbPath = dbPath;
  }

  async connect() {
    if (!this.db) {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
    }
  }

  async getData() {
    await this.connect();
    const data = await this.db.all('SELECT * FROM data');
    return data;
  }

  async setData(newData) {
    await this.connect();
    const keys = Object.keys(newData).join(', ');
    const values = Object.values(newData).map(() => '?').join(', ');
    const query = `INSERT INTO data (${keys}) VALUES (${values})`;

    await this.db.run(query, ...Object.values(newData));
  }

  async updateData(id, updatedData) {
    await this.connect();
    const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(', ');
    const query = `UPDATE data SET ${fields} WHERE id = ?`;

    await this.db.run(query, ...Object.values(updatedData), id);
  }

  async deleteData(id) {
    await this.connect();
    await this.db.run('DELETE FROM data WHERE id = ?', id);
  }

  async createSchema(schema) {
    await this.connect();

    // Check if table exists, if not create it
    const tableExists = await this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='data'`);

    if (!tableExists) {
      const fields = Object.entries(schema.properties).map(([key, value]) => {
        if (value.type === 'integer') return `${key} INTEGER`;
        if (value.type === 'string') return `${key} TEXT`;
        if (value.type === 'boolean') return `${key} INTEGER`; // SQLite doesn't have boolean, so we use INTEGER
        return `${key} TEXT`; // Default to TEXT if type is unrecognized
      }).join(', ');

      const query = `CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, ${fields})`;

      await this.db.exec(query);
      console.log('Schema created successfully.');
    } else {
      console.log('Table already exists.');
    }
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

module.exports = SQLiteAdapter;
