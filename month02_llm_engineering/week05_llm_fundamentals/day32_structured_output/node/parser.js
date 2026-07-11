const text = `
{
    "name":"Node.js",
    "type":"Runtime"
}
`;

try {
  const obj = JSON.parse(text);

  console.log(obj.name);
  console.log(obj.type);
} catch (error) {
  console.log("Invalid JSON");
}
