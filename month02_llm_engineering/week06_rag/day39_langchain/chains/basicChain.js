import model from "../groq.js";
import explainPrompt from "../prompts/promptTemplate.js";

const chain = explainPrompt.pipe(model);

export default chain;
