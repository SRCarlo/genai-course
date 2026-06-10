# Nested Data
    # Real AI applications rarely use simple data.
    
# Example
user = {
    "name": "Shubham Raut",
    "skills": [
        "Java",
        "Gen AI",
        "Node.js",
        "Next.js",
        "AI"
    ]
}
print(user)

# Access Data
print(user["skills"][0])

# Access Data (Complex Exa)
data = {
    "user":{
        "name": "Shubham Raut",
        "city": "Mumbai"
    }
}
print(data["user"]["name"])