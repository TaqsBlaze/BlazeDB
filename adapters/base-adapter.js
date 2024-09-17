// adapters/base-adapter.js
class BaseAdapter {
    async getData() {
      throw new Error('Method getData() must be implemented');
    }
  
    async setData(newData) {
      throw new Error('Method setData() must be implemented');
    }
  
    async updateData(id, updatedData) {
      throw new Error('Method updateData() must be implemented');
    }
  
    async deleteData(id) {
      throw new Error('Method deleteData() must be implemented');
    }
  
    async createSchema(schema) {
      throw new Error('Method createSchema() must be implemented');
    }
  }
  
  module.exports = BaseAdapter;
  