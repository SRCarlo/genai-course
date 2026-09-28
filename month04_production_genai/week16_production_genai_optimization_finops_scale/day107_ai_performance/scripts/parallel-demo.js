import { startTimer, elapsedMs } from "../src/performance/timer.js";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function operationA() {
  await sleep(300);

  return "Operation A completed";
}

async function operationB() {
  await sleep(500);

  return "Operation B completed";
}

async function operationC() {
  await sleep(200);

  return "Operation C completed";
}

const sequentialStart = startTimer();

const sequentialA = await operationA();
const sequentialB = await operationB();
const sequentialC = await operationC();

const sequentialTime = elapsedMs(sequentialStart);

console.log("\n________________ SEQUENTIAL ________________");

console.log(sequentialA);
console.log(sequentialB);
console.log(sequentialC);

console.log(`Sequential latency: ${sequentialTime.toFixed(2)}ms`);

const parallelStart = startTimer();

const [parallelA, parallelB, parallelC] = await Promise.all([
  operationA(),
  operationB(),
  operationC(),
]);

const parallelTime = elapsedMs(parallelStart);

console.log("\n________________ PARALLEL ________________");

console.log(parallelA);
console.log(parallelB);
console.log(parallelC);

console.log(`Parallel latency: ${parallelTime.toFixed(2)}ms`);

console.log("\n________________COMPARISON________________");

console.log(`Sequential: ${sequentialTime.toFixed(2)}ms`);

console.log(`Parallel:   ${parallelTime.toFixed(2)}ms`);

console.log(`Improvement: ${(sequentialTime - parallelTime).toFixed(2)}ms`);
