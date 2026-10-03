export function authenticate(req, { required = false, token = "" } = {}) {
  if (!required) return true;
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new Error("Authorization required");
  if (header.slice(7) !== token) throw new Error("Invalid token");
  return true;
}
