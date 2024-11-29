//Updated
const OrbDB = require('../orb'); 
const OrbDBSchema = require('../schema/schema');
const fs = require('fs').promises;
const path = require('path');

// Define JSON Adapter
const adapter = require('../adapters/jsonAdapter');
const dbPath = path.join(__dirname, './db.json');
describe('OrbDB with JSON Adapter', () => {
  let orbDB;

  beforeAll(async () => {
    orbDB = new OrbDB.Json(new adapter(dbPath));
    const schemaInstance = new OrbDBSchema(orbDB);
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
    const newUser = { id: 1, name: 'John Doe', age: 30 };
    await orbDB.insert(newUser);

    const dbData = await fs.readFile(dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
    
    expect(jsonData.data).toContainEqual(newUser);
  });

  test('should update a user', async () => {
    const updatedUser = { name: 'Blaze' };
    await orbDB.update(1, updatedUser);

    const dbData = await orbDB.get();
    const updatedUserData = dbData.find(user => user.id === 1);

    expect(updatedUserData.name).toBe('Blaze');
  });

  test('should delete a user', async () => {
    await orbDB.delete(1);

    const dbData = await orbDB.get();
    const deletedUserData = dbData.find(user => user.id === 1);

    expect(deletedUserData).toBeUndefined();
  });
});
