from transformers import pipeline


model_path = "../adapters/nodejs-assistant"


generator = pipeline(
    "text-generation",
    model=model_path
)


questions = [

"What is Node.js?",

"Explain Express middleware",

"What is npm?"

]


for q in questions:

    result = generator(
        q,
        max_new_tokens=80
    )

    print("\nQUESTION:")
    print(q)

    print("\nANSWER:")
    print(
        result[0]["generated_text"]
    )