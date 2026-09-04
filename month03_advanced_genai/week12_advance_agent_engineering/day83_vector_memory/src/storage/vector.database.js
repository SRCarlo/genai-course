export class VectorDatabase {
  async upsert(record) {
    throw new Error("Not implemented");
  }

  async search(vector, options = {}) {
    throw new Error("Not implemented");
  }

  async delete(id) {
    throw new Error("Not implemented");
  }

  async update(id, updates) {
    throw new Error("Not implemented");
  }
}
