// blazedb.js
class BlazeDB {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async get() {
    return this.adapter.get();
  }

  async insert(newData) {
    return this.adapter.insert(newData);
  }

  async update(id, updatedData) {
    return this.adapter.update(id, updatedData);
  }

  async delete(id) {
    return this.adapter.delete(id);
  }

  async createSchema(schema) {
    return this.adapter.createSchema(schema);
  }

  async close(){
    return this.adapter.close()
  }
}

  

module.exports = BlazeDB;
