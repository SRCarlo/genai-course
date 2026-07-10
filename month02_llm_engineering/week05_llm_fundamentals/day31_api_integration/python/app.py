from groq import Groq
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Create Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": "Explain Artificial Intelligence."
        }
    ]
)

print("\nAI Response:\n")
print(response.choices[0].message.content)