export class QueryRewriter {
  rewrite(query) {
    return query
      .trim()
      .replace(/\s+/g, " ");
  }
}