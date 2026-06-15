# AI PROMPT FILTER

prompt = input("Enter Prompt: ")

blocked_words = [
    "hack",
    "virus",
    "malware"
]

if prompt.lower() in blocked_words:
    print("Prompt Blocked")
else:
    print("Prompt Accepted")
    
# In Enter prompt only allows blocked words or other word not sentence.