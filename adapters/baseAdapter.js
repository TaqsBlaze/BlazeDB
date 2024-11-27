// adapters/base-adapter.js
class BaseAdapter {
    async get() {
      throw new Error('Method get() must be implemented');
    }
  
    async insert(newData) {
      throw new Error('Method insert() must be implemented');
    }
  
    async update(id, updatedData) {
      throw new Error('Method update() must be implemented');
    }
  
    async delete(id) {
      throw new Error('Method delete() must be implemented');
    }
  
    async createSchema(schema) {
      throw new Error('Method createSchema() must be implemented');
    }

    async close(){
      throw new Error('Method close() must be implemented');
    }
}
 
module.exports = BaseAdapter;
  