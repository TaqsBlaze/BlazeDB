const fs = require('fs');
const path = require('path');

class BlazeDB {
    
  constructor() {
    this.dbPath = path.join(__dirname, 'db.json');
  }

  async getData() {
    // TO DO: Implement data retrieval logic
    const dbData = await fs.readFile(this.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
    return jsonData.data;
  }

  async setData(data) {

    const dbData = await fs.readFile(this.dbPath, (err, data) => {

      if (err) {
        throw err;
      }

      return data.toString();

    });

    const jsonData = JSON.parse(dbData);
    jsonData.data.push(data);
    await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));

  }

  async deleteData(id) {
    // TO DO: Implement data deletion logic
    const dbData = await fs.readFileSync(this.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);
    jsonData.data = jsonData.data.filter(item => item.id !== id);
    await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));

  }

  async updateData(id, data) {
    // TO DO: Implement data update logic
    const dbData = await fs.readFileSync(this.dbPath, 'utf8');
    const jsonData = JSON.parse(dbData);

    jsonData.data.forEach(item => {

      if (item.id === id) {
        Object.assign(item, data);
      }
    });

    await fs.writeFile(this.dbPath, JSON.stringify(jsonData, null, 2));

  }


  // Creating database schema
  async createSchema(schema){

    await fs.writeFile(this.dbPath, JSON.stringify(schema, null, 2),(error) =>{

      if(error){
        console.log(error.message);
        throw error;
      }else{
        console.log(`Schema created successfully..`);
      
      }

    });

  }
}

module.exports = BlazeDB;