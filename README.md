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
