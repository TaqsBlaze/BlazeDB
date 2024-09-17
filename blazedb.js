// blazedb.js
class BlazeDB {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getData() {
    return this.adapter.getData();
  }

  async setData(newData) {
    return this.adapter.setData(newData);
  }

  async updateData(id, updatedData) {
    return this.adapter.updateData(id, updatedData);
  }

  async deleteData(id) {
    return this.adapter.deleteData(id);
  }

  async createSchema(schema) {
    return this.adapter.createSchema(schema);
  }
}

module.exports = BlazeDB;
