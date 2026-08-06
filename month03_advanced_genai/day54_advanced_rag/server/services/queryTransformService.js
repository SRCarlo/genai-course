const QUERY_EXPANSIONS = {
  auth: "authentication authorization",
  jwt: "json web token authentication",
  api: "rest api endpoint",
  db: "database mongodb",
  middleware: "express middleware request response next",
};

export function transformQuery(query) {
  let transformed = query.toLowerCase().trim();

  Object.entries(QUERY_EXPANSIONS).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    transformed = transformed.replace(regex, value);
  });

  return transformed;
}
