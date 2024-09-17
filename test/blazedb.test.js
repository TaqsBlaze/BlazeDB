const BlazeDB = require('../blazedb'); // Adjust the path if necessary
const BlazeDBSchema = require('../schema/db-schema'); // Adjust the path if necessary
const adapter = require('../adapters/json-adapter')
const fs = require('fs').promises;
const path = require('path');

describe('BlazeDB', () => {
  const dbPath = path.join(__dirname, '../db.json');
  let blazeDB;

  beforeAll(async () => {
    blazeDB = new BlazeDB(new adapter());
    // Initialize the db.json file with schema and data for testing
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
    schemaInstance.addModel(userModel);
    await schemaInstance.createSchema();
  });

  afterAll(async () => {
    // Clean up the test database file after all tests are complete
    await fs.unlink(dbPath);
  });

  test('should create a schema', async () => {
    const dbData = await fs.readFile(dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
    console.log("Data:", jsonData);

    // Check if schema properties are correctly set
    expect(jsonData.schema.properties).toHaveProperty('id');
    expect(jsonData.schema.properties).toHaveProperty('name');
    expect(jsonData.schema.properties).toHaveProperty('age');
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: 'John Doe', age: 30 };
    await blazeDB.setData(newUser);

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
