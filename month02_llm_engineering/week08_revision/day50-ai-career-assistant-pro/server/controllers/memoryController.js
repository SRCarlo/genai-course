import { saveMessage, getHistory } from "../memory/memoryService.js";

export const saveConversation = async (req, res) => {
  try {
    const { sessionId, role, content } = req.body;

    const message = await saveMessage(sessionId, role, content);

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const history = await getHistory(sessionId);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
