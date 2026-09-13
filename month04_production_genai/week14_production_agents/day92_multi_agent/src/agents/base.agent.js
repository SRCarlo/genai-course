export class BaseAgent {
  constructor({ name, role, tools = [], permissions = [] }) {
    this.name = name;
    this.role = role;
    this.tools = tools;
    this.permissions = permissions;
  }

  async execute(input) {
    throw new Error(`${this.name}: execute() must be implemented`);
  }

  getInfo() {
    return {
      name: this.name,
      role: this.role,
      tools: this.tools,
      permissions: this.permissions,
    };
  }
}
