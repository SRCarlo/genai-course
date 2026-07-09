"""
Day 30 - Prompt Engineering

Prompt Examples
"""

# Zero-Shot Prompt
zero_shot = """
Translate the following sentence into French.

Hello, how are you?
"""


# One-Shot Prompt
one_shot = """
Input:
Apple

Output:
Fruit

Input:
Carrot

Output:
"""

# Few-Shot Prompt
few_shot = """
Input:
Dog
Output:
Animal

Input:
Rose
Output:
Flower

Input:
Python
Output:
Programming Language

Input:
Laptop
Output:
"""

# Role Prompt
role_prompt = """
You are a Senior Python Developer.

Explain Python decorators with examples.
"""

# Chain of Thought Prompt
cot_prompt = """
Solve the following problem step by step.

If a car travels 150 km in 3 hours,
what is its average speed?
"""

prompts = {
    "Zero Shot": zero_shot,
    "One Shot": one_shot,
    "Few Shot": few_shot,
    "Role Prompt": role_prompt,
    "Chain of Thought": cot_prompt,
}

print("\nDAY 30 - PROMPT EXAMPLES")

for name, prompt in prompts.items():
    print(f"\n{name}")
    print("______________________________")
    print(prompt)