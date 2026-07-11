import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
  path: "../.env",
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeResume() {
  const resume = `
Name: Rahul Sharma

Skills:
JavaScript, Node.js, React, MongoDB, Express.js

Experience:
2 years experience as a Full Stack Developer.

Education:
B.Tech Computer Science from ABC University.

Projects:
Built AI applications and REST APIs.
`;

  const prompt = `

Analyze the following resume.

Return ONLY valid JSON.

Schema:

{
    "name":"",
    "skills":[],
    "experience":"",
    "education":[],
    "strengths":[]
}


Resume:

${resume}

`;

  try {
    console.log("Analyzing resume...");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      max_tokens: 500,
    });

    const output = response.choices[0].message.content;

    const cleanJSON = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanJSON);

    console.log("\nResume Analysis\n");

    console.log(JSON.stringify(result, null, 4));

    // Bonus: Save output
    fs.writeFileSync("resume.json", JSON.stringify(result, null, 4));

    console.log("\nSaved to resume.json");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

analyzeResume();
