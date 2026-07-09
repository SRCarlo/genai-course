"""
Day 30 - Prompt Engineering

Structured Output Example
"""

import json


prompt = """
You are an AI Assistant.

Explain Artificial Intelligence.

Return ONLY valid JSON.

{
    "definition":"",
    "advantages":[],
    "disadvantages":[],
    "applications":[]
}
"""


print("_________________PROMPT_________________")
print(prompt)


# Example response (simulating an LLM)
response = {
    "definition": (
        "Artificial Intelligence (AI) is the simulation of human intelligence "
        "by machines capable of learning, reasoning, and solving problems."
    ),
    "advantages": [
        "Automation",
        "High Accuracy",
        "Fast Decision Making",
        "24/7 Availability"
    ],
    "disadvantages": [
        "High Development Cost",
        "Job Displacement",
        "Data Privacy Concerns"
    ],
    "applications": [
        "Healthcare",
        "Finance",
        "Education",
        "Transportation",
        "Software Development"
    ]
}

print("\n____________________JSON Output______________________\n")
print(json.dumps(response, indent=4))