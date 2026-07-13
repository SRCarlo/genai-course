import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient


load_dotenv("../.env")


HF_TOKEN = os.getenv("HF_TOKEN")


client = InferenceClient(
    token=HF_TOKEN
)


def generate_embedding(text):

    result = client.feature_extraction(
        text,
        model="sentence-transformers/all-MiniLM-L6-v2"
    )


    embedding = result.tolist()


    print("Dimensions:", len(embedding))

    print("First 10 values:")
    print(embedding[:10])


    return embedding



generate_embedding(
    "Node.js is a JavaScript runtime."
)