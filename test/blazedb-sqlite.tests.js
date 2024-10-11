const BlazeDB = require('../blazedb');
const BlazeDBSchema = require('../schema/db-schema');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

// Define SQLite Adapter
const adapter = { name: 'SQLite Adapter', adapter: require('../adapters/sqlite-adapter'), dbPath: path.join(__dirname, '../blaze.db') };

describe('BlazeDB with SQLite Adapter', () => {
  let blazeDB;

  beforeAll(async () => {
    const sqliteAdapterInstance = new adapter.adapter();
    await sqliteAdapterInstance.init();  // Initialize SQLite connection
    blazeDB = new BlazeDB(sqliteAdapterInstance);

    const schemaInstance = new BlazeDBSchema(blazeDB);
    const userModel = {
      name: 'User',
      fields: {
        id: { type: 'number', required: true },
        name: { type: 'string', required: true },
        age: { type: 'number', required: false }
      }
    };

    schemaInstance.addModel(userModel);
    await schemaInstance.createSchema();
  });

  afterAll(async () => {
    if (adapter.dbPath) {
      await blazeDB.close();  // Ensure the database connection is closed
      try {
        await fs.unlink(adapter.dbPath);
      } catch (error) {
        console.error(`Error cleaning up the database at ${adapter.dbPath}:`, error);
      }
    }
  });


  test('should create a schema', async () => {
    const db = new sqlite3.Database(adapter.dbPath);
    db.serialize(() => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='User'", (err, table) => {
        expect(table).not.toBeUndefined();
      });
    });
    db.close();
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: 'John Doe', age: 30 };
    await blazeDB.insert(newUser);

    const db = new sqlite3.Database(adapter.dbPath);
    db.serialize(() => {
      db.get('SELECT * FROM User WHERE id = ?', [1], (err, row) => {
        expect(row.name).toBe('John Doe');
        expect(row.age).toBe(30);
      });
    });
    db.close();
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await blazeDB.update(1, updatedUser);

    const db = new sqlite3.Database(adapter.dbPath);
    db.serialize(() => {
      db.get('SELECT * FROM User WHERE id = ?', [1], (err, row) => {
        expect(row.name).toBe('Blaze');
      });
    });
    db.close();
  });

  test('should delete a user', async () => {
    await blazeDB.delete(1);

    const db = new sqlite3.Database(adapter.dbPath);
    db.serialize(() => {
      db.get('SELECT * FROM User WHERE id = ?', [1], (err, row) => {
        expect(row).toBeUndefined();
      });
    });
    blazeDB.close();
  });
});
