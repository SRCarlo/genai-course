export class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async generate(_request) {
    throw new Error("generate() must be implemented");
  }
}
