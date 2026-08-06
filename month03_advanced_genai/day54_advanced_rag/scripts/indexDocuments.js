import { loadDocuments } from "../server/services/documentLoader.js";

const documents = loadDocuments();

console.log("Indexing documents...\n");

documents.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.source}`);
  console.log(`Category : ${doc.category}`);
  console.log(`Framework: ${doc.framework}`);
  console.log(`Language : ${doc.language}`);
  console.log("-------------------------");
});

console.log(`\nIndexed ${documents.length} documents.`);
