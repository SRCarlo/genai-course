import { StringOutputParser } from "@langchain/core/output_parsers";

import model from "../groq.js";
import explainPrompt from "../prompts/promptTemplate.js";

const parser = new StringOutputParser();

const chain = explainPrompt
  .pipe(model)
  .pipe(parser);

export default chain;