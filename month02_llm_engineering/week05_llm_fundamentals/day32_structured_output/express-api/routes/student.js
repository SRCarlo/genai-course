import express from "express";

export default function studentRouter(groq) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    console.log("Request received");

    const prompt = `
Return ONLY valid JSON.

{
    "name":"",
    "grade":"",
    "percentage":""
}

Student: Rahul scored 90%.
`;

    try {
      console.log("Calling Groq API...");

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        max_tokens: 200,
      });

      console.log("Groq response received");

      const output = response.choices[0].message.content;

      const cleanJSON = output
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      res.json(JSON.parse(cleanJSON));
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Something went wrong",
      });
    }
  });

  return router;
}
