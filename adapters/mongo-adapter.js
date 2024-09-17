// adapters/mongo-adapter.js
const { MongoClient } = require('mongodb');
const BaseAdapter = require('./base-adapter');

class MongoAdapter extends BaseAdapter {
  constructor() {
    super();
    this.url = 'mongodb://localhost:27017';
    this.dbName = 'blazeDB';
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.url, { useUnifiedTopology: true });
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection('data');
    }
  }

  async getData() {
    await this.connect();
    return this.collection.find({}).toArray();
  }

  async setData(newData) {
    await this.connect();
    await this.collection.insertOne(newData);
  }

  async updateData(id, updatedData) {
    await this.connect();
    await this.collection.updateOne({ id }, { $set: updatedData });
  }

  async deleteData(id) {
    await this.connect();
    await this.collection.deleteOne({ id });
  }

  async createSchema(schema) {
    console.log('MongoDB does not need a schema to be created upfront.');
    // Optionally handle schema validation here if required
  }
}

module.exports = MongoAdapter;
