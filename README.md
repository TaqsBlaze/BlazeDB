# BlazeDB ![alt text](https://cdn-icons-png.flaticon.com/128/5246/5246837.png)

## Installation
`npm i blazedb@latest`


## Creating Schema

```
const blazedb = require('blazedb');
const dbschema = require('blazedb/schema');

const db = new blazedb();

//creating a model
const model = {
    id:'id',
    fields:{
        name:{type:'string',required:true},
        age:{type:'number',required:true}
    },
    options:{}
}


//creating schema
const schema = new dbschema(db);

schema.addModel(model);
schame.createSchema();
```

## Creating user

```
const blazedb = require('blazedb');
const dbschema = require('blazedb/schema');

const db = new blazedb();

//creating schema
class User {
  constructor() {
    this.fields = {
      name: { type: 'string' },
      email: { type: 'string', required: true },
      age: { type: 'number' },
      isAdmin: { type: 'boolean' }
    };
  }
}

const schema = new dbschema(db);

schema.addModel(User);

//entering user data
const user1 = new User();
user1.fields.name = 'John Doe';
user1.fields.email = 'johndoe@example.com';
user1.fields.age = 30;
user1.isAdmin = false;

db.setData(user1).then((error) =>{
    if(error){
        console.log(error.message);
    }else{
        console.log("User added successfully..");
    }
});
```

# Using Adapters

## json Adapter

### How to us


```
const BlazeDB = require('./blazedb'); // Import BlazeDB
const JSONAdapter = require('./adapters/json-adapter'); // Import the JSON adapter
const BlazeDBSchema = require('./schema/db-schema'); // Import the schema handler
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, 'db.json'); // Path to the JSON database file

async function main() {
  // Initialize BlazeDB with the JSONAdapter
  const blazeDB = new BlazeDB(new JSONAdapter(dbPath));

  // Define your schema (or load it from some external source)
  const userModel = {
    name: 'User',
    properties: {
      id: { type: 'integer', required: true },
      name: { type: 'string', required: true },
      age: { type: 'integer', required: false }
    }
  };

  // Create schema handler
  const schemaInstance = new BlazeDBSchema(blazeDB);
  schemaInstance.addModel(userModel);

  // Create or load schema from the database
  await schemaInstance.createSchema();

  // Example usage: Add a user
  const newUser = { id: 1, name: 'Blaze', age: 30 };
  await blazeDB.setData(newUser);

  // Fetch all users from the database
  const users = await blazeDB.getData();
  console.log('Users:', users);

  // Example usage: Update a user
  const updatedUser = { name: 'Blaze Updated' };
  await blazeDB.updateData(1, updatedUser);

  // Fetch updated users from the database
  const updatedUsers = await blazeDB.getData();
  console.log('Updated Users:', updatedUsers);

  // Example usage: Delete a user
  await blazeDB.deleteData(1);
  const remainingUsers = await blazeDB.getData();
  console.log('Remaining Users:', remainingUsers);
}

main().catch((error) => {
  console.error('Error:', error);
});

```



## Contributing

We welcome contributions to the project! Here’s how you can help:

### How to Contribute

1. **Fork the Repository**: Click on the fork button at the top-right corner of this page. This will create a copy of the repository under your GitHub account.

2. **Clone Your Fork**: Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/taqqsblaze/BlazeDB
    cd BlazeDB
    ```

3. **Create a New Branch**: It’s important to create a new branch for your changes:
    ```bash
    git checkout -b feature-branch-name
    ```
    (Use a descriptive name for your branch to indicate the feature or fix you are working on.)

4. **Make Your Changes**: Open the project in your favorite code editor and make your changes.

5. **Write Tests**: If you are adding new features or making changes, please ensure that your code is tested. Place your tests in the `test` directory.

6. **Run Tests**: Make sure all tests pass. (Adjust this command based on your testing framework.)
    ```bash
    npm test
    ```

7. **Commit Your Changes**: Once you are satisfied with your changes, commit them with a descriptive message:
    ```bash
    git add .
    git commit -m "Add a brief description of your changes"
    ```

8. **Push Your Changes**: Push your changes to your forked repository:
    ```bash
    git push origin feature-branch-name
    ```

9. **Create a Pull Request**: Go to the original repository where you want to propose your changes. Click on the "Pull Requests" tab, and then click on "New Pull Request". Select your branch and submit your pull request.


For more detailed instructions, please see [CONTRIBUTING.md](CONTRIBUTING.md).
<hr>

### Code of Conduct

Please adhere to this project's [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

### Issues

If you encounter any problems, feel free to open an issue in the issues tab. Please provide as much detail as possible.

### Discussion

For any major changes, please create an issue first to discuss it. This helps maintainers and collaborators understand your intentions.


Thank you for your interest in contributing!