export class BaseProvider {
  constructor(name) {
    this.name = name;
  }
  async generate() {
    throw new Error("generate() must be implemented");
  }
}
