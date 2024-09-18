const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class SQLiteAdapter {
  constructor() {
    this.dbPromise = open({
      filename: '../db.sqlite',
      driver: sqlite3.Database
    });
  }

  async init() {
    this.db = await this.dbPromise;
  }

  async createSchema({ tableName, properties }) {
    console.log("SCHEMA PASSED:", { tableName, properties });

    if (!this.db) {
      await this.init();
    }

    const columns = Object.entries(properties).map(([key, value]) => {
      const type = value.type === 'string' ? 'TEXT' :
                   value.type === 'integer' ? 'INTEGER' :
                   value.type === 'boolean' ? 'BOOLEAN' : 'TEXT';
      return `${key} ${type}`;
    }).join(', ');

    // Check if table exists
    const tableExists = await this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
    if (!tableExists) {
      await this.db.run(`CREATE TABLE ${tableName} (${columns})`);
    }
  }

  async insert(tableName, data) {
    if (!this.db) {
      await this.init();
    }

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    await this.db.run(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, Object.values(data));
  }

  async update(tableName, id, data) {
    if (!this.db) {
      await this.init();
    }

    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    await this.db.run(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`, [...Object.values(data), id]);
  }

  async delete(tableName, id) {
    if (!this.db) {
      await this.init();
    }

    await this.db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
  }

  async get(tableName) {
    if (!this.db) {
      await this.init();
    }

    return this.db.all(`SELECT * FROM ${tableName}`);
  }
}

module.exports = SQLiteAdapter;
