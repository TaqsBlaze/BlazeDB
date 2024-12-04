class Session {
    constructor(dbAdapter) {
      this.dbAdapter = dbAdapter; // The underlying adapter (e.g., JSON or SQLite)
      this.operations = []; // Store pending operations
      this.active = true; // Indicates if the session is active
    }
  
    // Add an operation to the session
    addOperation(type, tableName, data) {
      if (!this.active) {
        throw new Error('Cannot add operations to an inactive session.');
      }
  
      this.operations.push({ type, tableName, data });
      console.log(`Operation added: ${type} on '${tableName}'`, data);
    }
  
    // Commit all operations to the database
    async commit() {
      if (!this.active) {
        throw new Error('Session is no longer active.');
      }
  
      try {
        for (const op of this.operations) {
          if (op.type === 'insert') {
            await this.dbAdapter.insert(op.tableName, op.data);
          } else if (op.type === 'update') {
            await this.dbAdapter.update(op.tableName, op.data);
          } else if (op.type === 'delete') {
            await this.dbAdapter.delete(op.tableName, op.data);
          }
        }
  
        console.log('Transaction committed successfully.');
      } catch (err) {
        console.error('Error during commit:', err);
        throw err;
      } finally {
        this.clear(); // Clear operations and deactivate the session
      }
    }
  
    // Rollback: Discard all pending operations
    rollback() {
      if (!this.active) {
        throw new Error('Session is no longer active.');
      }
  
      this.clear();
      console.log('Transaction rolled back.');
    }
  
    // Clear all pending operations and deactivate session
    clear() {
      this.operations = [];
      this.active = false;
    }
  }
  