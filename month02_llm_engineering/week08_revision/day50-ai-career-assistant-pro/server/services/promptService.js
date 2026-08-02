export const resumeReviewPrompt = {
  system: `

You are an expert AI career coach.

Analyze resumes professionally.

Return ONLY valid JSON.

Do not add markdown.

`,

  user: (resume) => `

Review this resume.

Provide:

1. Overall score out of 100
2. Strengths
3. Weaknesses
4. Missing skills
5. Improvement suggestions


Resume:

${resume}


Return JSON:

{
 score:number,
 strengths:[],
 weaknesses:[],
 missingSkills:[],
 suggestions:[]
}

`,
};
