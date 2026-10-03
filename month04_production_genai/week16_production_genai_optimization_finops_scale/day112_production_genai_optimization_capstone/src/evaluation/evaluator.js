export function evaluateResponse(response) {
  const text = response?.text || "";
  return { hasResponse: text.length > 0, responseLength: text.length, valid: text.length > 0 };
}
