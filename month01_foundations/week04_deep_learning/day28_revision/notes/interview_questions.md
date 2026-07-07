# AI / ML / Deep Learning / LLM Interview Questions and Answers

## Month 1 Interview Preparation Notes

---

# Artificial Intelligence Fundamentals

---

## 1. What is Artificial Intelligence (AI)?

### Answer:

Artificial Intelligence is a branch of computer science that focuses on creating systems capable of performing tasks that normally require human intelligence.

Examples:

- Understanding language
- Recognizing images
- Decision making
- Problem solving


AI includes:

```
Artificial Intelligence

↓

Machine Learning

↓

Deep Learning

↓

Generative AI

↓

Large Language Models
```

---

# 2. Difference Between AI, ML, DL, and GenAI?


## Artificial Intelligence

AI is the broad field of creating intelligent machines.


Example:

- Self-driving cars
- AI assistants


---

## Machine Learning

Machine Learning allows computers to learn patterns from data.


Example:

- Spam detection
- Price prediction


---

## Deep Learning

Deep Learning uses neural networks with multiple layers.


Example:

- Image recognition
- Speech recognition


---

## Generative AI

Generative AI creates new content.


Examples:

- Text generation
- Image generation
- Code generation


---

# 3. What is Machine Learning?

### Answer:

Machine Learning is a method where computers learn patterns from data and improve performance without being explicitly programmed.


Machine Learning types:

1. Supervised Learning
2. Unsupervised Learning
3. Reinforcement Learning


---

# 4. Difference Between Supervised and Unsupervised Learning?


## Supervised Learning

Uses labeled data.


Example:

Input:

```
Study Hours
Attendance
```

Output:

```
Pass / Fail
```


Algorithms:

- Linear Regression
- Logistic Regression
- Decision Trees


---

## Unsupervised Learning

Uses unlabeled data.


Goal:

Find hidden patterns.


Example:

Customer segmentation


Algorithm:

- K-Means


---

# Python Interview Questions

---

# 5. Why is Python popular in AI?

### Answer:

Python is popular because:

- Simple syntax
- Large community
- Many AI libraries
- Fast development


Important libraries:

- NumPy
- Pandas
- PyTorch
- TensorFlow
- Transformers


---

# 6. Difference Between List and Tuple?


## List

Mutable.

Example:

```python
numbers=[1,2,3]

numbers.append(4)
```


## Tuple

Immutable.

Example:

```python
point=(10,20)
```


---

# 7. What is OOP?

### Answer:

Object-Oriented Programming is a programming approach based on classes and objects.


Four principles:

1. Encapsulation
2. Inheritance
3. Polymorphism
4. Abstraction


---

# 8. What is a Function?

### Answer:

A function is a reusable block of code that performs a specific task.


Example:

```python
def add(a,b):

    return a+b
```


---

# Data Science Questions

---

# 9. What is NumPy?

### Answer:

NumPy is a Python library used for numerical computing.


Features:

- Arrays
- Matrix operations
- Mathematical functions


Example:

```python
import numpy as np

arr=np.array([1,2,3])
```


---

# 10. What is Pandas?

### Answer:

Pandas is a Python library used for data manipulation and analysis.


Features:

- DataFrames
- Data cleaning
- Data transformation


Example:

```python
df=pd.read_csv("data.csv")
```


---

# 11. What is Data Cleaning?

### Answer:

Data cleaning is the process of preparing raw data by removing errors.


Includes:

- Handling missing values
- Removing duplicates
- Correcting formats


---

# Mathematics Questions

---

# 12. Why is Mathematics important in AI?


### Answer:

Mathematics provides the foundation for understanding how AI models learn.


Important areas:

- Linear Algebra
- Probability
- Statistics
- Calculus


---

# 13. What is a Vector?

### Answer:

A vector is a collection of numbers representing data.


Example:

```
[1,2,3]
```


Used in:

- Machine learning features
- Embeddings


---

# 14. What is a Matrix?


### Answer:

A matrix is a rectangular arrangement of numbers.


Example:

```
1 2

3 4
```


Used in:

- Neural networks
- Transformations


---

# 15. What is Gradient Descent?


### Answer:

Gradient Descent is an optimization algorithm used to minimize model error.


Process:

```
Prediction

↓

Calculate Loss

↓

Calculate Gradient

↓

Update Weights
```


Formula:

```
New Weight =
Old Weight -
Learning Rate × Gradient
```


---

# Machine Learning Questions

---

# 16. What is Regression?


### Answer:

Regression predicts continuous numerical values.


Examples:

- House prices
- Sales prediction


Algorithms:

- Linear Regression


---

# 17. What is Classification?


### Answer:

Classification predicts categories or classes.


Examples:

- Spam detection
- Disease prediction


Algorithms:

- Logistic Regression
- Decision Tree


---

# 18. What is Clustering?


### Answer:

Clustering groups similar data points together without labels.


Example:

Customer segmentation


Algorithm:

- K-Means


---

# 19. What is Overfitting?


### Answer:

Overfitting occurs when a model learns training data too well but performs poorly on new data.


Solutions:

- More data
- Regularization
- Dropout


---

# 20. What is Underfitting?


### Answer:

Underfitting occurs when a model is too simple to learn patterns.


Solution:

- Increase model complexity
- Train longer


---

# Deep Learning Questions

---

# 21. What is a Neural Network?


### Answer:

A neural network is a computing system inspired by the human brain.


It contains:

- Input layer
- Hidden layers
- Output layer


---

# 22. What is a Neuron?


### Answer:

A neuron receives inputs, applies weights and bias, then produces output.


Formula:

```
Output =
Activation(Weight × Input + Bias)
```


---

# 23. What are Weights?


### Answer:

Weights determine the importance of inputs.


During training, weights are updated to reduce error.


---

# 24. What is Bias?


### Answer:

Bias allows a model to shift predictions and improve flexibility.


---

# 25. What is Activation Function?


### Answer:

Activation functions introduce non-linearity into neural networks.


Examples:

- ReLU
- Sigmoid
- Tanh


---

# 26. Explain ReLU.


### Answer:

ReLU stands for Rectified Linear Unit.


Formula:

```
max(0,x)
```


Advantages:

- Fast computation
- Reduces vanishing gradient problem


---

# 27. Explain Sigmoid.


### Answer:

Sigmoid converts values into probabilities between 0 and 1.


Formula:

```
1/(1+e^-x)
```


Used in:

Binary classification


---

# 28. What is Loss Function?


### Answer:

Loss function measures the difference between predicted output and actual output.


Examples:

- MSE
- Cross Entropy Loss


---

# 29. What is Backpropagation?


### Answer:

Backpropagation calculates gradients and updates weights.


Steps:

1. Forward pass
2. Calculate loss
3. Calculate gradients
4. Update weights


---

# PyTorch Questions

---

# 30. What is PyTorch?


### Answer:

PyTorch is an open-source deep learning framework used to build and train neural networks.


Features:

- Tensor computation
- Automatic differentiation
- GPU support


---

# 31. What is a Tensor?


### Answer:

A tensor is a multi-dimensional array used to store numerical data.


Example:

```python
torch.tensor([1,2,3])
```


---

# 32. What is nn.Module?


### Answer:

`nn.Module` is the base class for creating neural networks in PyTorch.


Example:

```python
class Model(nn.Module):
    pass
```


---

# 33. What is an Optimizer?


### Answer:

Optimizer updates model weights during training.


Examples:

- SGD
- Adam


---

# Transformer Questions

---

# 34. What is Attention?


### Answer:

Attention allows models to focus on important parts of input data.


Used in:

- Transformers
- LLMs


---

# 35. What is Self-Attention?


### Answer:

Self-attention allows each token to understand relationships with other tokens in the same sequence.


---

# 36. What is a Transformer?


### Answer:

Transformer is a neural network architecture based on attention mechanisms.


Used in:

- GPT
- BERT
- LLaMA


---

# 37. Transformer Architecture


Components:

```
Input

↓

Embedding

↓

Positional Encoding

↓

Attention

↓

Feed Forward

↓

Output
```


---

# 38. What are Embeddings?


### Answer:

Embeddings convert text or data into numerical vectors representing meaning.


Example:

```
AI

↓

[0.23,0.56,0.91]
```


---

# LLM Questions

---

# 39. What is an LLM?


### Answer:

A Large Language Model is a neural network trained on massive amounts of text data to understand and generate language.


Examples:

- GPT
- BERT
- LLaMA


---

# 40. What is Tokenization?


### Answer:

Tokenization converts text into smaller units called tokens.


Example:

```
"I love AI"

↓

I
love
AI
```


---

# 41. GPT vs BERT


| GPT | BERT |
|-|-|
| Decoder only | Encoder only |
| Text generation | Text understanding |
| Autoregressive | Bidirectional |


---

# 42. What is Fine-tuning?


### Answer:

Fine-tuning adapts a pre-trained model to a specific task using additional training data.


---

# 43. What is Prompt Engineering?


### Answer:

Prompt engineering is designing effective instructions to get better results from AI models.


---

# Project Questions

---

# 44. Explain Student Performance Predictor Project.


### Answer:

The project predicts student pass/fail results using a PyTorch neural network.


Input:

- Study Hours
- Attendance


Output:

- Pass
- Fail


Steps:

1. Create dataset
2. Load data using Pandas
3. Convert data into tensors
4. Train neural network
5. Save model
6. Predict new students


---

# 45. Why save a trained model?


### Answer:

Saving allows us to reuse the trained model without retraining.


PyTorch:

```python
torch.save()
```


---

# 46. Training vs Testing Data


Training data:

Used to learn patterns.


Testing data:

Used to evaluate performance.


---

# 47. What is Model Deployment?


### Answer:

Deployment means making a trained model available for real-world usage.


Examples:

- APIs
- Web applications
- Mobile apps


---

# 48. What Skills are Needed for LLM Engineering?


Required skills:

- Python
- Mathematics
- Deep Learning
- Transformers
- Prompt Engineering
- Vector Databases
- RAG
- Model Deployment


---

# 49. Difference Between AI Model and AI Application?


AI Model:

The trained algorithm.


AI Application:

Complete product using the model.


Example:

GPT model → ChatGPT application


---

# 50. Explain Complete AI Pipeline.


```
Data Collection

↓

Data Cleaning

↓

Feature Engineering

↓

Model Training

↓

Evaluation

↓

Deployment

↓

Monitoring
```


---