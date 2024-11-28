class Json {
  // Json Adapter
  constructor(adapter) {
    this.adapter = adapter;
  }

  async get() {
    return this.adapter.get();
  }

  async insert(tableName, newData) {
    return this.adapter.insert(tableName,newData);
  }

  async update(tableName, id, updatedData) {
    return this.adapter.update(tableName, id, updatedData);
  }

  async delete(tableName, id) {
    return this.adapter.delete(tableName, id);
  }

  async createSchema(schema) {
    return this.adapter.createSchema(schema);
  }

  async close() {
    return this.adapter.close();
  }
}

class Sql {

  // Sqlite adapter 

  constructor(adapter) {
    this.adapter = adapter;
  }

  async get(tableName) {
    return this.adapter.get(tableName);
  }

  async insert(tableName, newData) {
    return this.adapter.insert(tableName, newData);
  }

  async update(tableName, id, updatedData) {
    return this.adapter.update(tableName, id, updatedData);
  }

  async delete(tableName, id) {
    return this.adapter.delete(tableName, id);
  }

  async createSchema(tableName, properties) {
    return this.adapter.createSchema(tableName, properties);
  }

  async close() {
    return this.adapter.close();
  }
}

class BlazeDB {
  static Json = Json;
  static Sql = Sql;
}

module.exports = BlazeDB;
