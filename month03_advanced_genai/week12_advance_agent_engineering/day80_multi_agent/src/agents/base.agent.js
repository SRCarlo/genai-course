export class BaseAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  async run(input, state) {
    throw new Error(`${this.name}: run() must be implemented`);
  }
}
