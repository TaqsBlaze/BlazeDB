const BlazeDB = require('../blazedb'); 
const BlazeDBSchema = require('../schema/db-schema');
const fs = require('fs').promises;
const path = require('path');

// Define JSON Adapter
const adapter = { name: 'JSON Adapter', adapter: require('../adapters/json-adapter'), dbPath: path.join(__dirname, '../db.json') };

describe('BlazeDB with JSON Adapter', () => {
  let blazeDB;

  beforeAll(async () => {
    blazeDB = new BlazeDB(new adapter.adapter());
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
      try {
        await fs.unlink(adapter.dbPath);
      } catch (error) {
        console.error(`Error cleaning up the database at ${adapter.dbPath}:`, error);
      }
    }
  });

  test('should create a schema', async () => {
    const dbData = await fs.readFile(adapter.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);

    expect(jsonData.schema.properties).toHaveProperty('id');
    expect(jsonData.schema.properties).toHaveProperty('name');
    expect(jsonData.schema.properties).toHaveProperty('age');
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: 'John Doe', age: 30 };
    await blazeDB.insert(newUser);

    const dbData = await fs.readFile(adapter.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
    
    expect(jsonData.data).toContainEqual(newUser);
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await blazeDB.update(1, updatedUser);

    const dbData = await blazeDB.get();
    const updatedUserData = dbData.find(user => user.id === 1);

    expect(updatedUserData.name).toBe('Blaze');
  });

  test('should delete a user', async () => {
    await blazeDB.delete(1);

    const dbData = await blazeDB.get();
    const deletedUserData = dbData.find(user => user.id === 1);

    expect(deletedUserData).toBeUndefined();
  });
});
