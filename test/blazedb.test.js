const BlazeDB = require('../blazedb'); // Adjust the path if necessary
const BlazeDBSchema = require('../schema/db-schema'); // Adjust the path if necessary
const fs = require('fs').promises;
const path = require('path');

// Define all adapters you want to test
const adapters = [
  { name: 'JSON Adapter', adapter: require('../adapters/json-adapter'), dbPath: path.join(__dirname, '../db.json') },
  { name: 'SQLite Adapter', adapter: require('../adapters/sqlite-adapter'), dbPath: path.join(__dirname, '../blaze.db') },
  //{ name: 'MongoDB Adapter', adapter: require('../adapters/mongo-adapter'), dbPath: null } // MongoDB doesn't use a local dbPath
];

// Test suite for all adapters
describe.each(adapters)('BlazeDB with $name', ({ adapter, dbPath }) => {
  let blazeDB;

  beforeAll(async () => {
    blazeDB = new BlazeDB(new adapter());
    // Initialize the database file with schema and data for testing if required
    const schemaInstance = new BlazeDBSchema(blazeDB);
    const userModel = {
      name: 'User',
      fields: {
        id: { type: 'number', required: true },
        name: { type: 'string', required: true },
        age: { type: 'number', required: false }
      }
    };

    // Dynamically create schema instead of hardcoding it

    // if(adapter.name == 'SQLite Adapter'){
    //   console.log("SCHEMA PASS DATA:", userModel)
    //   schemaInstance.addModel(userModel);
    // }
    schemaInstance.addModel(userModel);
    await schemaInstance.createSchema();
  });

  afterAll(async () => {
    // Clean up the test database file after all tests are complete if dbPath exists (skip for MongoDB)
    if (dbPath) {
      try {
        await fs.unlink(dbPath);
      } catch (error) {
        console.error(`Error cleaning up the database at ${dbPath}:`, error);
      }
    }
  });

  test('should create a schema', async () => {
    if (dbPath) {
      const dbData = await fs.readFile(dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);

      // Check if schema properties are correctly set
      expect(jsonData.schema.properties).toHaveProperty('id');
      expect(jsonData.schema.properties).toHaveProperty('name');
      expect(jsonData.schema.properties).toHaveProperty('age');
    } else {
      // For non-file-based databases, directly check the schema
      const schemaData = await blazeDB.getSchema();
      expect(schemaData.properties).toHaveProperty('id');
      expect(schemaData.properties).toHaveProperty('name');
      expect(schemaData.properties).toHaveProperty('age');
    }
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: 'John Doe', age: 30 };
    await blazeDB.setData(newUser);

    if (dbPath) {
      const dbData = await fs.readFile(dbPath, 'utf8');
      const jsonData = JSON.parse(dbData);
      console.log("Data:", jsonData);
    }

    const dbData = await blazeDB.getData();
    expect(dbData).toContainEqual(newUser);
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await blazeDB.updateData(1, updatedUser);

    const dbData = await blazeDB.getData();
    const updatedUserData = dbData.find(user => user.id === 1);

    expect(updatedUserData.name).toBe('Blaze');
  });

  test('should delete a user', async () => {
    await blazeDB.deleteData(1);

    const dbData = await blazeDB.getData();
    const deletedUserData = dbData.find(user => user.id === 1);

    expect(deletedUserData).toBeUndefined();
  });
});
