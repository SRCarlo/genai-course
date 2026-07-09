"""
Reusable Prompt Template Example
"""


PROMPT_TEMPLATE = """
You are a {role}.

Task:
{task}

Context:
{context}

Instructions:
{instructions}

Constraints:
{constraints}

Output Format:
{output_format}
"""


def build_prompt(
    role: str,
    task: str,
    context: str,
    instructions: str,
    constraints: str,
    output_format: str,
) -> str:
    """
    Build a reusable prompt using placeholders.
    """

    return PROMPT_TEMPLATE.format(
        role=role,
        task=task,
        context=context,
        instructions=instructions,
        constraints=constraints,
        output_format=output_format,
    )


def main():
    prompt = build_prompt(
        role="Senior AI Engineer",
        task="Explain Prompt Engineering",
        context="Audience: Beginners",
        instructions="Use simple language and practical examples.",
        constraints="Maximum 300 words.",
        output_format="Markdown",
    )


    print("\n________________GENERATED PROMPT___________________")
    print(prompt)


if __name__ == "__main__":
    main()