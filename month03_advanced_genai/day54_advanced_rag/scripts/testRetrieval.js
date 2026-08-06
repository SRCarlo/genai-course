import { hybridSearch } from "../server/services/hybridSearchService.js";

const query = "Express middleware request response";

const results = await hybridSearch(query);

console.log("\nHybrid Search Results\n");

results.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.source}`);

  console.log("Hybrid Score:", doc.hybridScore);

  console.log("------------------------");
});
