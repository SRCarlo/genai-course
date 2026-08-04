from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer
)

from peft import PeftModel



BASE_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

ADAPTER = "../adapters/nodejs-assistant"



tokenizer = AutoTokenizer.from_pretrained(
    BASE_MODEL
)


model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL
)



model = PeftModel.from_pretrained(
    model,
    ADAPTER
)



prompt = """
Explain Express middleware.
"""


inputs = tokenizer(
    prompt,
    return_tensors="pt"
)


outputs = model.generate(
    **inputs,
    max_new_tokens=100
)


print(
    tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )
)