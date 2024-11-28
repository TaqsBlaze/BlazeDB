const BlazeDB = require('blazedb'); 
const BlazeDBSchema = require('blaze/schema');
const fs = require('fs').promises;
const path = require('path');

// Define JSON Adapter
const adapter = require('blaze/adapters/jsonAdapter');
const dbPath = path.join(__dirname, './db.json');

let blazeDB;

blazeDB = new BlazeDB.Json(new adapter(dbPath));
const schemaInstance = new BlazeDBSchema(blazeDB);
const userModel = {
  name: 'User',
  fields: {
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  age: { type: 'number', required: false }
  }
};

// Create schema handler
schemaInstance.addModel(userModel);
await schemaInstance.createSchema();

 

let a1 = ( async () =>{
// Example usage: Add a user
const newUser = { id: 1, name: 'John Doe', age: 30 };
await blazeDB.insert(newUser);

const dbData = await fs.readFile(dbPath, 'utf8');
const jsonData = JSON.parse(dbData);
});

let a2 = ( async () => {
// Fetch all users from the database
const users = await blazeDB.get();
console.log('Users:', users);

// Example usage: Update a user
const updatedUser = { name: 'Blaze' };
await blazeDB.update(1, updatedUser);

const dbData = await blazeDB.get();
const updatedUserData = dbData.find(user => user.id === 1);
});

let a3 = ( async () => {
// Fetch updated users from the database
const updatedUsers = await blazeDB.get();
console.log('Updated Users:', updatedUsers);
});

let a4 = ( async () =>{
// Example usage: Delete a user
await blazeDB.delete(1);

const dbData = await blazeDB.get();
const deletedUserData = dbData.find(user => user.id === 1);
});


async function main(){
    await a1();
    await a2();
    await a3();
    await a4();
}

await main()