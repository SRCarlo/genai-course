import { resumeTool } from "../tools/resumeTool.js";
import { ragTool } from "../tools/ragTool.js";
import { roadmapTool } from "../tools/roadmapTool.js";

export const careerAgent = async (query, type) => {
  switch (type) {
    case "resume":
      return await resumeTool(query);

    case "roadmap":
      return await roadmapTool(query);

    case "rag":
      return await ragTool(query);

    default:
      throw new Error("Unknown agent type");
  }
};
