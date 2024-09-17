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

## sqlite Adapter

### How to us

First of all you need to install the sqlite package
```
npm install sqlite3 sqlite
```

```
// app.js
const BlazeDB = require('./blazedb');
const SQLiteAdapter = require('./adapters/sqlite-adapter');

// Using SQLite adapter
const blazeDBWithSQLite = new BlazeDB(new SQLiteAdapter());

// Create a schema
const schema = {
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    age: { type: 'integer' }
  }
};

async function run() {
  await blazeDBWithSQLite.createSchema(schema);

  // Add some data
  await blazeDBWithSQLite.setData({ id: 1, name: 'Blaze', age: 30 });
  await blazeDBWithSQLite.setData({ id: 2, name: 'John Doe', age: 25 });

  // Get data
  const data = await blazeDBWithSQLite.getData();
  console.log(data);

  // Update a user
  await blazeDBWithSQLite.updateData(1, { name: 'Blaze Updated' });

  // Delete a user
  await blazeDBWithSQLite.deleteData(2);

  // Close the connection when done
  await blazeDBWithSQLite.close();
}

run();
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