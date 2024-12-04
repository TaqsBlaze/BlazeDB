//Updated
const OrbDB = require('../orb'); 
const OrbDBSchema = require('../schema/schema');
const fs = require('fs').promises;
const path = require('path');

// Define JSON Adapter
const adapter = require('../adapters/jsonAdapter');
const dbPath = path.join(__dirname, './db.json');
const userModel = {
  name: 'User',
  fields: {
    id: { type: 'number', required: true },
    name: { type: 'string', required: true },
    age: { type: 'number', required: true }
  }
};
describe('OrbDB with JSON Adapter', () => {
  let orbDB;

  beforeAll(async () => {
    orbDB = new OrbDB.Json(new adapter(dbPath));
    const schemaInstance = new OrbDBSchema(orbDB);
    
    schemaInstance.addModel(userModel);
    await schemaInstance.createSchema();
  });

  afterAll(async () => {
    if (dbPath) {
      try {
        await fs.unlink(dbPath);
      } catch (error) {
        console.error(`Error cleaning up the database at ${dbPath}:`, error);
      }
    }
  });

  test('should create a schema', async () => {
    const dbData = await fs.readFile(dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);

    expect(jsonData.schema.properties).toHaveProperty('id');
    expect(jsonData.schema.properties).toHaveProperty('name');
    expect(jsonData.schema.properties).toHaveProperty('age');
  });

  test('should add a user', async () => {
    const newUser = { id: 1, name: '<b>John Doe</b>./;+=-_', age: 30 };
    const newUserc = { id: 1, name: 'John Doe', age: 30 };
    await orbDB.insert(userModel.name, newUser);

    const dbData = await fs.readFile(dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
 
    expect(jsonData["schema"][userModel.name]).toContainEqual(newUserc);
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await orbDB.update(userModel.name, 1, updatedUser);

    const dbData = await orbDB.get(userModel.name);
    const updatedUserData = dbData.find(user => user.id === 1);

    expect(updatedUserData.name).toBe('Blaze');
  });

  test('should delete a user', async () => {
    await orbDB.delete(userModel.name, 1);

    const dbData = await orbDB.get(userModel.name);
    const deletedUserData = dbData.find(user => user.id === 1);

    expect(deletedUserData).toBeUndefined();
  });
});
