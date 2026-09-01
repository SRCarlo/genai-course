export function route(task) {
  const text = task.toLowerCase();

  if (
    text.includes("review") ||
    text.includes("security") ||
    text.includes("bug")
  ) {
    return "reviewer";
  }

  if (
    text.includes("code") ||
    text.includes("implement") ||
    text.includes("build")
  ) {
    return "coder";
  }

  if (
    text.includes("research") ||
    text.includes("compare") ||
    text.includes("explain")
  ) {
    return "researcher";
  }

  return "researcher";
}
