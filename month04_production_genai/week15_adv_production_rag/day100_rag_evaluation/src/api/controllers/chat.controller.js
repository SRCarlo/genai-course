import { chat } from "../../application/chat.service.js";

export async function postChat(req, res, next) {
  try {
    const result = await chat(req.body?.question);

    if (result.error?.type === "INVALID_INPUT") {
      return res.status(400).json(result);
    }

    if (result.error?.type === "LLM_ERROR") {
      return res.status(502).json(result);
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
