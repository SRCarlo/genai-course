import { cosineSimilarity } from "./vector.similarity.js";

const a = [1, 0, 0];
const b = [1, 0, 0];

console.log("Same direction:");
console.log(cosineSimilarity(a, b));

const c = [1, 0, 0];
const d = [0, 1, 0];

console.log("Different direction:");
console.log(cosineSimilarity(c, d));

const e = [1, 0, 0];
const f = [-1, 0, 0];

console.log("Opposite direction:");
console.log(cosineSimilarity(e, f));
