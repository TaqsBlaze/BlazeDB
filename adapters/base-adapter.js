// adapters/base-adapter.js
class BaseAdapter {
    async get() {
      throw new Error('Method getData() must be implemented');
    }
  
    async insert(newData) {
      throw new Error('Method setData() must be implemented');
    }
  
    async update(id, updatedData) {
      throw new Error('Method updateData() must be implemented');
    }
  
    async delete(id) {
      throw new Error('Method deleteData() must be implemented');
    }
  
    async createSchema(schema) {
      throw new Error('Method createSchema() must be implemented');
    }

    async close(){
      throw new Error('Method close() must be implemented');
    }
  }
  
  module.exports = BaseAdapter;
  