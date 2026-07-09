"""
Day 30 - Prompt Engineering

Prompt Testing Example
"""

prompts = [
    "Explain Artificial Intelligence.",

    "Explain Artificial Intelligence in 100 words.",

    "Explain Artificial Intelligence for a 10-year-old.",

    "You are a Senior AI Engineer. Explain Artificial Intelligence with examples.",

    """Return JSON.

{
    "definition":"",
    "advantages":[],
    "applications":[]
}
"""
]

print("__________________PROMPT TESTING__________________\n")

for i, prompt in enumerate(prompts, start=1):

    print(f"\n_____________Prompt {i}__________________\n")

    print(prompt)

    print("\nExpected Goal")

    if i == 1:
        print("General explanation")

    elif i == 2:
        print("Concise explanation")

    elif i == 3:
        print("Beginner-friendly explanation")

    elif i == 4:
        print("Professional explanation")

    else:
        print("Structured JSON response")
