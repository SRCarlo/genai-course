import { documents } from "../data/documents.js";

export class DocumentStore {
  constructor(items = documents) {
    this.documents = items;
  }

  getAll() {
    return this.documents;
  }

  getById(id) {
    return this.documents.find(
      (document) => document.id === id
    );
  }
}