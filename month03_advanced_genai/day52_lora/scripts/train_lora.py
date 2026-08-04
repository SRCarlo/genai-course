from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments
)

from trl import SFTTrainer

from peft import (
    get_peft_model
)

from configs.lora_config import lora_config

from datasets import load_dataset



MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"


OUTPUT_DIR = "../adapters/nodejs-assistant"



tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)


model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME
)



model = get_peft_model(
    model,
    lora_config
)



model.print_trainable_parameters()



dataset = load_dataset(
    "json",
    data_files="../dataset/processed_train.json"
)



training_args = TrainingArguments(

    output_dir="../outputs",

    per_device_train_batch_size=1,

    gradient_accumulation_steps=4,

    learning_rate=2e-4,

    num_train_epochs=3,

    logging_steps=10,

    save_steps=100

)



trainer = SFTTrainer(

    model=model,

    train_dataset=dataset["train"],

    args=training_args,

    dataset_text_field="text",

    tokenizer=tokenizer

)



trainer.train()



model.save_pretrained(
    OUTPUT_DIR
)


tokenizer.save_pretrained(
    OUTPUT_DIR
)


print("LoRA training completed")