from groq import Groq
from dotenv import load_dotenv
import os


# Load environment variables
load_dotenv()


# Create Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


prompt = """
Explain Python.

Return ONLY valid JSON.

{
    "name":"",
    "type":"",
    "creator":"",
    "use_cases":[]
}
"""


response = client.chat.completions.create(

    model="llama-3.3-70b-versatile",

    messages=[

        {
            "role": "user",
            "content": prompt
        }

    ]

)


print(response.choices[0].message.content)