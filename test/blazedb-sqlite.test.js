const OrbDB = require('../orb');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');
const adapterModule = require('../adapters/sqliteAdapter'); // Import the adapter class

describe('OrbDB with SQLite Adapter', () => {
  let orbDB;
  let sqliteAdapterInstance;
  const dbPath = path.join(__dirname, './db.sqlite3');
  beforeAll(async () => {
    sqliteAdapterInstance = new adapterModule(dbPath); // Create an instance of SQLiteAdapter
    await sqliteAdapterInstance.init(); // Initialize SQLite connection

    // Create the schema for the test table
    await sqliteAdapterInstance.createSchema('test_table', {
      id: { type: 'integer' },
      name: { type: 'string' },
      isActive: { type: 'boolean' },
    });

    // Initialize OrbDB with the SQLite adapter instance
    orbDB = new OrbDB.Sql(sqliteAdapterInstance);
  });

  afterAll(async () => {
    if (sqliteAdapterInstance.dbPath) {
      await orbDB.close(); // Ensure the database connection is closed
      try {
        await fs.unlink(sqliteAdapterInstance.dbPath);
      } catch (error) {
        console.error(`Error cleaning up the database at ${sqliteAdapterInstance.dbPath}:`, error);
      }
    }
  });

  test('createSchema should create a table with the given schema', async () => {
    const tableName = 'test_table';

    // Verify that the table was created
    const result = await sqliteAdapterInstance.db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [tableName]
    );
    expect(result).not.toBeNull();
    expect(result.name).toBe(tableName);

    // Verify the schema by checking the table's columns
    const schema = await sqliteAdapterInstance.db.all(`PRAGMA table_info(${tableName})`);
    const columnNames = schema.map((col) => col.name);
    expect(columnNames).toEqual(expect.arrayContaining(['id', 'name', 'isActive']));
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: 'John Doe', isActive: false };
    await orbDB.insert('test_table', newUser);

    const row = await sqliteAdapterInstance.db.get('SELECT * FROM test_table WHERE id = ?', [1]);
    expect(row.name).toBe('John Doe');
    expect(row.isActive).toBe(0); // SQLite uses 0 for false
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await orbDB.update('test_table', 1, updatedUser);

    const row = await sqliteAdapterInstance.db.get('SELECT * FROM test_table WHERE id = ?', [1]);
    expect(row.name).toBe('Blaze');
  });

  test('should delete a user', async () => {
    await orbDB.delete('test_table', 1);

    const row = await sqliteAdapterInstance.db.get('SELECT * FROM test_table WHERE id = ?', [1]);
    expect(row).toBeUndefined();
  });
});
