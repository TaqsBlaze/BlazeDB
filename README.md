<!-- # orbDB ![alt text](https://raw.githubusercontent.com/TaqsBlaze/BlazeDB/refs/heads/main/image/pixel.webp) -->

## Installation
`npm i orbdb@latest`

----
## json Adapter

### How to us


```
const OrbDB = require('orb'); 
const PixelDB = require('orb/schema');
const fs = require('fs').promises;
const path = require('path');

// Define JSON Adapter
const adapter = require('orb/adapters/jsonAdapter');
const dbPath = path.join(__dirname, './db.json');

let orbDB;

orbDB = new OrbDB.Json(new adapter(dbPath));
const schemaInstance = new PixelDB(orbDB);
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

 

// Example usage: Add a user
const newUser = { id: 1, name: 'John Doe', age: 30 };
await orbDB.insert(userModel.name, newUser);

const dbData = await fs.readFile(dbPath, 'utf8');
const jsonData = JSON.parse(dbData);

// Fetch all users from the database
const users = await orbDB.get(userModel.name);
console.log('Users:', users);

// Example usage: Update a user
const updatedUser = { name: 'Blaze' };
await orbDB.update(userModel.name, 1, updatedUser);

const dbData = await orbDB.get(userModel.name);
const updatedUserData = dbData.find(user => user.id === 1);

// Fetch updated users from the database
const updatedUsers = await orbDB.get(userModel.name);
console.log('Updated Users:', updatedUsers);

// Example usage: Delete a user
await orbDB.delete(userModel.name, 1);

const dbData = await orbDB.get(userModel.name);
const deletedUserData = dbData.find(user => user.id === 1);



```
### Adaptors:
```
Now json and sqlite adapters are fully functional and ready for use
```

## Contributing

We welcome contributions to the project! Here’s how you can help:

### How to Contribute

1. **Fork the Repository**: Click on the fork button at the top-right corner of this page. This will create a copy of the repository under your GitHub account.

2. **Clone Your Fork**: Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/taqsblaze/BlazeDB
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
---
new featers soon
Thank you for your interest in contributing!
