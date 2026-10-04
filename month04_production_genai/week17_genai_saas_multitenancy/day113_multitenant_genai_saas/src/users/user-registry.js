const users = new Map([
  [
    "user-001",
    {
      id: "user-001",
      name: "Acme Admin",
      email: "admin@acme.example"
    }
  ],
  [
    "user-002",
    {
      id: "user-002",
      name: "Beta User",
      email: "user@beta.example"
    }
  ],
  [
    "user-003",
    {
      id: "user-003",
      name: "Enterprise Admin",
      email: "admin@enterprise.example"
    }
  ]
]);

export class UserRegistry {
  get(userId) {
    const user = users.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { ...user };
  }
}