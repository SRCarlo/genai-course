"""
Prompt Library CLI

Day 30 Assignment
"""

from prompt_library import generate_prompt


MENU = """

________________Prompt Library____________________

1. Code Generation

2. Code Review

3. SQL Generator

4. API Documentation

5. Resume Review

0. Exit

______________________________________

"""


PROMPT_TYPES = {
    "1": "code_generation",
    "2": "code_review",
    "3": "sql_generator",
    "4": "api_documentation",
    "5": "resume_review"
}


while True:

    print(MENU)

    choice = input("Choose Prompt Type: ")

    if choice == "0":
        print("\nGoodbye!")
        break

    if choice not in PROMPT_TYPES:
        print("\nInvalid Choice\n")
        continue

    role = input("Role: ")
    task = input("Task: ")
    context = input("Context: ")
    constraints = input("Constraints: ")
    output = input("Output Format: ")

    prompt = generate_prompt(
        PROMPT_TYPES[choice],
        role,
        task,
        context,
        constraints,
        output
    )

    print("\n_____________Generated Prompt_________________")

    print(prompt)