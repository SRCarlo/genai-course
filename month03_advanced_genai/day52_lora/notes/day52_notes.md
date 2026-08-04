# DAY 52 - LoRA & QLoRA

## LoRA

Low Rank Adaptation.

Original model weights remain frozen.

Only small adapter matrices are trained.

## Formula

ΔW = B × A

## Parameters

r:

Controls rank.

alpha:

Controls scaling.

dropout:

Regularization.

## QLoRA

QLoRA = Quantization + LoRA.

Base model is quantized.

LoRA adapters are trained.

## Production

Node.js API

↓

AI Service

↓

Base Model + LoRA Adapter

↓

Response
