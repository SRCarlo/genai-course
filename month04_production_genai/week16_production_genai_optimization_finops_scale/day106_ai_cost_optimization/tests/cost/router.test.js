import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseModel,
  chooseGroqModel
} from "../../src/cost/model-router.js";

test("high complexity selects large label", () => {
  assert.equal(
    chooseModel({ complexity: "HIGH" }),
    "large-model"
  );
});

test("medium complexity selects medium label", () => {
  assert.equal(
    chooseModel({ complexity: "MEDIUM" }),
    "medium-model"
  );
});

test("low complexity selects small label", () => {
  assert.equal(
    chooseModel({ complexity: "LOW" }),
    "small-model"
  );
});

test("Groq model is the requested model", () => {
  assert.equal(
    chooseGroqModel(),
    "openai/gpt-oss-20b"
  );
});