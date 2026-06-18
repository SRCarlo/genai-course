# Day 9 Notes - Probability for AI Engineers

## 🎯 Day Goal

* Probability
* Outcomes
* Events
* Conditional Probability
* Bayes Theorem
* Probability Simulations
* LLM Token Prediction
* How ChatGPT Uses Probability

---

# What is Probability?

Probability measures the chance of an event occurring.

It tells us how likely something is to happen.

## Formula

P(Event) = Favorable Outcomes / Total Outcomes

Where:

* Favorable Outcomes = Desired outcomes
* Total Outcomes = All possible outcomes

---

## Example: Coin Toss

Possible outcomes:

* Head
* Tail

Total outcomes = 2

Probability of getting Head:

P(Head) = 1 / 2

P(Head) = 0.5

P(Head) = 50%

### Python Example

```python
head_probability = 1 / 2

print(head_probability)
```

Output:

```text
0.5
```

---

# Probability Range

Probability always lies between:

```text
0 ≤ P(Event) ≤ 1
```

### Examples

| Probability | Meaning    |
| ----------- | ---------- |
| 0           | Impossible |
| 0.5         | 50% Chance |
| 1           | Certain    |

---

# Outcome

An outcome is a single possible result of an experiment.

### Example

Dice Roll

Possible outcomes:

```text
1
2
3
4
5
6
```

Each number is an outcome.

Example:

```text
Outcome = 4
```

---

# Event

An event is a collection of one or more outcomes.

### Example

Getting an Even Number

Possible outcomes:

```text
2
4
6
```

This group is called an event.

### Python Example

```python
outcomes = [1, 2, 3, 4, 5, 6]

even_numbers = [2, 4, 6]

print(outcomes)
print(even_numbers)
```

---

# Probability of Dice Roll

Question:

What is the probability of getting 2?

Favorable outcomes:

```text
1
```

Total outcomes:

```text
6
```

Calculation:

```text
P(2) = 1 / 6
```

Answer:

```text
0.1667
```

### Python Example

```python
probability = 1 / 6

print(probability)
```

---

# Conditional Probability

Conditional Probability means:

Probability of Event A occurring given that Event B has already occurred.

## Formula

P(A|B) = P(A and B) / P(B)

Where:

* A = Event A
* B = Event B

---

## Example

Probability of Rain

Given:

Clouds already exist.

Because clouds exist, rain becomes more likely.

Example:

```text
P(Rain | Clouds) = 0.7
```

Meaning:

70% chance of rain if clouds are present.

### Python Example

```python
rain_given_clouds = 0.7

print(rain_given_clouds)
```

---

# Bayes Theorem

Bayes Theorem is one of the most important formulas in AI.

It helps update probabilities when new information becomes available.

## Formula

P(A|B) = [P(B|A) × P(A)] / P(B)

Where:

* P(A) = Prior Probability
* P(B|A) = Likelihood
* P(B) = Evidence
* P(A|B) = Posterior Probability

---

# Medical Test Example

Before test:

```text
Disease Probability = 10%
```

Positive test result arrives.

Now probability increases.

Bayes Theorem updates the probability using the new evidence.

---

## Python Example

```python
prior = 0.10

likelihood = 0.90

evidence = 0.20

posterior = (
    likelihood * prior
) / evidence

print(posterior)
```

Output:

```text
0.45
```

---

# Bayes Theorem Applications

Used in:

* Spam Detection
* Fraud Detection
* Recommendation Systems
* Medical Diagnosis
* Search Engines
* AI Assistants

---

# Coin Toss Simulation

Instead of calculating probability, we can simulate it.

### Python Example

```python
import random

for i in range(10):

    toss = random.choice(
        ["Head", "Tail"]
    )

    print(toss)
```

Possible Output:

```text
Head
Tail
Head
Tail
Head
```

---

# Dice Simulation

### Python Example

```python
import random

for i in range(10):

    dice = random.randint(
        1,
        6
    )

    print(dice)
```

Possible Output:

```text
4
2
6
1
3
```

---

# Probability in AI

Probability is the foundation of Artificial Intelligence.

AI systems do not "know" answers.

They predict the most likely answer.

Examples:

* Machine Learning
* Deep Learning
* Search Engines
* Recommendation Systems
* ChatGPT
* Claude
* Gemini

---

# LLM Token Prediction

Suppose user writes:

```text
I love programming with
```

Possible next words:

| Word       | Probability |
| ---------- | ----------- |
| Python     | 0.65        |
| JavaScript | 0.20        |
| Java       | 0.10        |
| Node.js    | 0.05        |

Highest Probability:

```text
Python
```

Model selects:

```text
Python
```

---

# Mini LLM Simulation

```python
next_words = {
    "I love": {
        "Python": 0.7,
        "Java": 0.2,
        "C++": 0.1
    }
}

sentence = "I love"

prediction = max(
    next_words[sentence],
    key=next_words[sentence].get
)

print(
    "Predicted Word:",
    prediction
)
```

Output:

```text
Predicted Word: Python
```

---

# How ChatGPT Works

Very simplified process:

```text
Input Sentence
       ↓
Tokenization
       ↓
Probability Calculation
       ↓
Highest Probability Token
       ↓
Next Word Generated
```

---

# Node.js Equivalent

### Python

```python
probability = 1 / 6
```

### Node.js

```javascript
const probability = 1 / 6;
```

### Python

```python
import random

random.randint(1, 6)
```

### Node.js

```javascript
Math.floor(
    Math.random() * 6
) + 1;
```

---

# Key Learning

* Probability measures chance.
* Outcomes are individual results.
* Events are collections of outcomes.
* Conditional Probability depends on existing information.
* Bayes Theorem updates beliefs using evidence.
* LLMs use probability to predict the next token.
* ChatGPT generates text using probability distributions.

---

# Interview Questions and Answers

## 1. What is Probability?

Answer:

Probability measures the likelihood of an event occurring.

Formula:

P(Event) = Favorable Outcomes / Total Outcomes

---

## 2. What is the range of Probability?

Answer:

Probability lies between 0 and 1.

* 0 = Impossible
* 1 = Certain

---

## 3. What is an Outcome?

Answer:

A single possible result of an experiment.

Example:

Dice Roll → 4

---

## 4. What is an Event?

Answer:

A collection of outcomes.

Example:

Even Numbers = {2, 4, 6}

---

## 5. What is Conditional Probability?

Answer:

Probability of an event occurring given another event has already occurred.

---

## 6. What is Bayes Theorem?

Answer:

A mathematical formula used to update probabilities using new evidence.

---

## 7. What is Prior Probability?

Answer:

Initial belief before seeing new evidence.

---

## 8. What is Posterior Probability?

Answer:

Updated probability after observing new evidence.

---

## 9. Why is Probability Important in AI?

Answer:

AI systems make predictions using probabilities.

---

## 10. Where is Bayes Theorem used?

Answer:

* Spam Detection
* Fraud Detection
* Recommendation Systems
* Medical Diagnosis

---

## 11. What is the probability of getting Head in a coin toss?

Answer:

P(Head) = 1 / 2 = 0.5

---

## 12. What is the probability of rolling a 6 on a dice?

Answer:

P(6) = 1 / 6 = 0.1667

---

## 13. How do LLMs use Probability?

Answer:

LLMs calculate probabilities for possible next tokens and choose the most likely token.

---

## 14. How does ChatGPT generate text?

Answer:

Input → Tokenization → Probability Calculation → Next Token Prediction → Generated Text

---

## 15. What is a Probability Distribution?

Answer:

A list of possible outcomes and their probabilities.

Example:

Python → 0.70

Java → 0.20

C++ → 0.10
