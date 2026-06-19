# Day 10 Notes - Statistics for AI Engineers

# Introduction to Statistics

Statistics is the branch of mathematics that deals with collecting, organizing, analyzing, interpreting, and presenting data.

In Artificial Intelligence and Machine Learning, statistics helps us understand the quality and characteristics of data before training models.

Without statistics, we cannot know:

* Whether data is reliable
* Whether data contains errors
* Whether data contains outliers
* Whether data is balanced
* Whether data is suitable for model training

Statistics is one of the most important foundations of AI and Machine Learning.

---

# Why Statistics Matters in AI

Every AI project follows a process similar to:

Collect Data
↓
Analyze Data
↓
Clean Data
↓
Train Model
↓
Evaluate Model

Before training a model, AI engineers must understand the dataset.

Statistics helps answer questions such as:

* What is the average value?
* How spread out is the data?
* Are there unusual values?
* Is the dataset balanced?
* Does the dataset contain noise?

Poor quality data often results in poor quality models.

Good Data → Good AI

Bad Data → Bad AI

---

# Mean (Average)

## Definition

Mean is the average value of a dataset.

It is calculated by adding all values and dividing by the total number of values.

## Formula

Mean = Sum of Values / Number of Values

## Example

Dataset:

10, 20, 30, 40, 50

Step 1:

10 + 20 + 30 + 40 + 50 = 150

Step 2:

150 ÷ 5 = 30

Mean = 30

## Python Example

```python
numbers = [10, 20, 30, 40, 50]

mean = sum(numbers) / len(numbers)

print(mean)
```

Output:

30.0

## AI Use Case

Suppose an online store wants to know the average amount customers spend.

Purchase Values:

100
150
200
250
300

Mean Purchase Value = 200

This helps businesses understand customer behavior.

---

# Median

## Definition

Median is the middle value in a sorted dataset.

Median is useful when data contains outliers because it is less affected than the mean.

## Example 1

Dataset:

5, 10, 15, 20, 25

Middle Value = 15

Median = 15

## Example 2

Dataset:

10, 20, 30, 40

There are two middle values:

20 and 30

Median:

(20 + 30) ÷ 2

= 25

## Python Example

```python
from statistics import median

numbers = [5, 10, 15, 20, 25]

print(median(numbers))
```

Output:

15

## AI Use Case

Median is commonly used when data contains extreme values.

For example:

Salary Dataset:

20000
25000
30000
35000
500000

Mean becomes very high because of 500000.

Median gives a more realistic representation of typical salaries.

---

# Mode

## Definition

Mode is the value that appears most frequently in a dataset.

A dataset may have:

* One mode
* Multiple modes
* No mode

## Example

Dataset:

1, 2, 2, 3, 3, 3, 4

Mode = 3

Because 3 appears most often.

## Python Example

```python
from statistics import mode

numbers = [1, 2, 2, 3, 3, 3, 4]

print(mode(numbers))
```

Output:

3

## AI Use Case

Mode is useful for categorical data.

Example:

Favorite Color Dataset:

Blue
Blue
Red
Green
Blue

Mode = Blue

A recommendation system may use this information.

---

# Variance

## Definition

Variance measures how spread out data points are from the mean.

Low variance means values are close together.

High variance means values are spread far apart.

## Example of Low Variance

20
21
22
23
24

Values are close together.

## Example of High Variance

5
20
50
100
200

Values are widely spread.

## Formula

Variance = Average Squared Difference From Mean

## Python Example

```python
from statistics import variance

numbers = [10, 20, 30, 40, 50]

print(variance(numbers))
```

Output:

250

## AI Use Case

Variance helps identify whether features are informative.

Features with extremely low variance often provide little useful information for machine learning models.

---

# Standard Deviation

## Definition

Standard deviation is the square root of variance.

It measures the average distance of data points from the mean.

## Interpretation

Small Standard Deviation:

Data points are close to the mean.

Large Standard Deviation:

Data points are far from the mean.

## Python Example

```python
from statistics import stdev

numbers = [10, 20, 30, 40, 50]

print(stdev(numbers))
```

Output:

15.811

## AI Use Case

Many machine learning algorithms perform better when features are standardized using standard deviation.

Examples:

* Logistic Regression
* Support Vector Machines
* Neural Networks

---

# Outliers

## Definition

Outliers are values that are significantly different from the rest of the dataset.

## Example

Dataset:

20
22
21
23
24
500

Outlier = 500

## Why Outliers Are Dangerous

Outliers can:

* Distort averages
* Create noise
* Reduce model accuracy
* Cause incorrect conclusions

## Example

Dataset:

10
20
30
40
50

Mean = 30

Dataset with Outlier:

10
20
30
40
50
1000

Mean = 191.67

The outlier drastically changes the mean.

## Python Example

```python
data = [20, 22, 21, 23, 24, 500]

for value in data:

    if value > 100:

        print("Outlier:", value)
```

Output:

Outlier: 500

---

# Data Distribution

## Definition

Data distribution describes how data values are spread across a dataset.

Understanding distribution is important because machine learning models often assume certain patterns in data.

## Types of Distribution

### 1. Normal Distribution

Bell-shaped curve.

Most values are near the center.

Examples:

* Human height
* Exam scores
* IQ scores

### 2. Uniform Distribution

All values occur with similar frequency.

Example:

Random numbers generated evenly.

### 3. Skewed Distribution

Values are concentrated more on one side.

Examples:

* Income distribution
* House prices

---

# AI Data Quality

Data quality determines how useful a dataset is for machine learning.

## Characteristics of Good Data

### Accurate

Data correctly represents reality.

### Complete

No important information is missing.

### Consistent

Data follows the same format and rules.

### Relevant

Data is useful for solving the problem.

### Clean

Data contains minimal errors and noise.

---

# Impact of Poor Data Quality

Poor Data Can Cause:

* Wrong predictions
* Biased models
* Low accuracy
* Poor user experience

Example:

If a spam detection dataset contains incorrect labels, the model will learn incorrect patterns.

---

# How AI Companies Use Statistics

Google

* Search trend analysis
* User behavior analysis

Netflix

* Movie recommendation systems
* Viewing pattern analysis

Amazon

* Product recommendation systems
* Customer behavior analysis

OpenAI

* Dataset quality analysis
* Model evaluation
* Performance measurement

---

# Statistics in Machine Learning

Statistics is used in:

* Data Cleaning
* Feature Engineering
* Data Visualization
* Model Training
* Model Evaluation
* A/B Testing
* Recommendation Systems

Machine Learning cannot be understood properly without statistics.

---

# Interview Questions and Answers

## What is Statistics?

Statistics is the science of collecting, analyzing, and interpreting data.

---

## What is Mean?

Mean is the average of all values in a dataset.

---

## What is Median?

Median is the middle value after sorting the dataset.

---

## What is Mode?

Mode is the most frequently occurring value.

---

## What is Variance?

Variance measures how spread out data points are.

---

## What is Standard Deviation?

Standard deviation measures how far values are from the mean.

---

## What is an Outlier?

An outlier is a value significantly different from other values.

---

## Why Are Outliers Important?

They can negatively affect model accuracy and statistical calculations.

---

## Difference Between Mean and Median?

Mean = Average

Median = Middle Value

Median is less sensitive to outliers.

---

## Why Is Statistics Important in AI?

Statistics helps understand, clean, and prepare data before training models.

---

## What Happens if Data Quality Is Poor?

Poor data quality results in poor model performance and inaccurate predictions.

---

# Summary

* Mean = Average
* Median = Middle Value
* Mode = Most Frequent Value
* Variance = Spread of Data
* Standard Deviation = Distance from Mean
* Outlier = Unusual Value
* Statistics is the foundation of AI and Machine Learning
* Better Data Quality leads to Better Models

Good Data = Good AI

Bad Data = Bad AI
