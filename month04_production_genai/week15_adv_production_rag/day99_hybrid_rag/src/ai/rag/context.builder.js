export function buildContext(results) {
  return results
    .map(
      (r, i) =>
        `\nSOURCE ${i + 1}\nID: ${r.id}\nDocument: ${r.metadata?.source || r.title}\n\n${r.content}\n`,
    )
    .join("\n");
}
