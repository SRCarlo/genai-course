"""
Day 30 Assignment

Prompt Library

Reusable Prompt Templates
"""

PROMPTS = {

    "code_generation": """
You are a {role}.

Task:
{task}

Context:
{context}

Constraints:
{constraints}

Output Format:
{output_format}
""",

    "code_review": """
You are a {role}.

Review the following code.

Context:
{context}

Requirements:

- Find bugs
- Suggest improvements
- Explain issues
- Provide optimized code

Output:
{output_format}
""",

    "sql_generator": """
You are a Database Expert.

Generate an SQL query.

Task:
{task}

Database Context:
{context}

Constraints:
{constraints}

Output:
{output_format}
""",

    "api_documentation": """
You are a Technical Writer.

Create API documentation.

Context:
{context}

Task:
{task}

Output:
{output_format}
""",

    "resume_review": """
You are a Senior Recruiter.

Review the resume.

Context:
{context}

Requirements:

- Strengths
- Weaknesses
- Improvements
- ATS Suggestions

Output:
{output_format}
"""
}


def generate_prompt(
        prompt_type,
        role,
        task,
        context,
        constraints,
        output_format):

    template = PROMPTS[prompt_type]

    return template.format(
        role=role,
        task=task,
        context=context,
        constraints=constraints,
        output_format=output_format
    )


if __name__ == "__main__":

    prompt = generate_prompt(
        prompt_type="code_generation",
        role="Senior Python Developer",
        task="Create a REST API using FastAPI",
        context="Backend Interview",
        constraints="Use type hints and comments",
        output_format="Markdown"
    )

    print(prompt)