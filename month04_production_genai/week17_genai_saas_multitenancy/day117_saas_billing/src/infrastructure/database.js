// Day 117 intentionally uses in-memory repositories for learning.
// Replace these repositories with a durable database in production.
export function createDatabase() {
  return {
    name: "in-memory-learning-database"
  };
}
