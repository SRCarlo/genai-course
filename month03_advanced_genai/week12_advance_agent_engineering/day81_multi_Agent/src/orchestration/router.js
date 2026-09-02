export class Router {
  constructor() {
    this.routes = new Map();
  }

  register(name, agent) {
    if (!name || !agent) {
      throw new Error("Agent name and agent are required");
    }

    this.routes.set(name, agent);

    return this;
  }

  has(name) {
    return this.routes.has(name);
  }

  get(name) {
    const agent = this.routes.get(name);

    if (!agent) {
      throw new Error(`Agent '${name}' is not registered`);
    }

    return agent;
  }

  route(name) {
    return this.get(name);
  }

  list() {
    return [...this.routes.keys()];
  }
}
