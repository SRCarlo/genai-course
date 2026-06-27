# Day 18 - Clustering (K-Means) | Unsupervised Machine Learning

---
# 1. Introduction

Clustering is one of the most popular techniques in Unsupervised Machine Learning.

Unlike Regression or Classification, clustering does not require labeled data. The algorithm automatically groups similar data points based on their characteristics.

---

# 2. Machine Learning Types

```text
Machine Learning
│
├── Supervised Learning
│   ├── Regression
│   └── Classification
│
└── Unsupervised Learning
    └── Clustering
```

## Supervised Learning

* Uses labeled data.
* Predicts an output.
* Examples:

  * House Price Prediction
  * Student Marks Prediction

## Unsupervised Learning

* Uses unlabeled data.
* Finds hidden patterns.
* Groups similar data automatically.

---

# 3. What is Unsupervised Learning?

Unsupervised Learning is a type of Machine Learning where the dataset does not contain output labels.

The algorithm learns patterns and relationships without knowing the correct answers.

### Example Dataset

| Age | Salary |
| --- | ------ |
| 20  | 25000  |
| 25  | 30000  |
| 30  | 45000  |

Notice that there is no output column.

---

# 4. What is Clustering?

Clustering is the process of grouping similar data points together.

Customers with similar age, salary, or spending habits are placed into the same cluster.

Example

```text
Customer Data

↓

Cluster 0

↓

Cluster 1

↓

Cluster 2
```

---

# 5. Real-World Examples

## Amazon

* Customer Segmentation
* Product Recommendation

## Netflix

* Movie Recommendation
* User Grouping

## Spotify

* Playlist Recommendation
* Song Classification

## Banks

* Risk Analysis
* Loan Approval

## Healthcare

* Patient Segmentation
* Disease Analysis

## Marketing

* Customer Targeting
* Personalized Advertising

---

# 6. What is K-Means?

K-Means is the most widely used clustering algorithm.

* K = Number of Clusters
* Means = Average (Centroid)

Example

```text
K = 3

↓

Cluster 0

Cluster 1

Cluster 2
```

---

# 7. K-Means Workflow

```text
Dataset

↓

Choose K

↓

Random Centroids

↓

Assign Data Points

↓

Update Centroids

↓

Repeat Until Stable

↓

Final Clusters
```

---

# 8. Important Terminology

## K

K represents the number of clusters to create.

Example

```text
K = 4

Means the algorithm will create 4 clusters.
```

### Centroid

A centroid is the center point (average) of all data points in a cluster.

Example

```text
20
22
25
27

Average = 23.5

Centroid = 23.5
```

### Cluster

A collection of similar data points.

---

# 9. K-Means in Python

```python
from sklearn.cluster import KMeans

model = KMeans(
    n_clusters=3,
    random_state=42
)
```

---

# 10. Important Functions

## fit()

Trains the model.

```python
model.fit(data)
```

---

## predict()

Predicts the cluster for new data.

```python
model.predict([[25, 30000, 40]])
```

---

## fit_predict()

Trains the model and returns cluster labels.

```python
labels = model.fit_predict(data)
```

---

## cluster_centers_

Returns the centroid of each cluster.

```python
print(model.cluster_centers_)
```

---

## labels_

Returns the cluster assigned to every row.

```python
print(model.labels_)
```

Example Output

```text
[0 0 1 2 2]
```

---

# 11. Customer Segmentation

Customer Segmentation divides customers into groups based on similar characteristics.

Example

```text
Budget Customers

↓

Premium Customers

↓

Luxury Customers
```

Businesses use customer segmentation for:

* Marketing
* Product Recommendations
* Customer Analysis
* Sales Improvement

---

# 12. Advantages

* Easy to understand
* Fast and efficient
* No labels required
* Useful for customer segmentation
* Available in Scikit-Learn
* Works well on medium-sized datasets

---

# 13. Limitations

* Need to choose K before training.
* Sensitive to outliers.
* Works best with spherical clusters.
* Different initialization may produce different results.
* Not suitable for irregularly shaped clusters.

---

# 14. Applications

* Customer Segmentation
* Recommendation Systems
* Fraud Detection
* Healthcare
* Banking
* Marketing
* Image Compression
* Social Network Analysis
* Sales Analytics
* Document Clustering

---

# 15. Supervised vs Unsupervised Learning

| Supervised Learning | Unsupervised Learning |
| ------------------- | --------------------- |
| Uses labeled data   | Uses unlabeled data   |
| Predicts output     | Finds hidden patterns |
| Regression          | Clustering            |
| Classification      | Segmentation          |
| Output available    | No output available   |

---

# 16. Complete Example

```python
import pandas as pd
from sklearn.cluster import KMeans

df = pd.read_csv("customer_data.csv")

model = KMeans(
    n_clusters=2,
    random_state=42
)

df["Cluster"] = model.fit_predict(df)

print(df)

print(model.cluster_centers_)

prediction = model.predict([[25, 32000]])

print(prediction)
```

---

# 17. Key Points

* Clustering is an Unsupervised Learning technique.
* No labels are required.
* K-Means groups similar data points.
* K represents the number of clusters.
* Centroid is the center of a cluster.
* fit() trains the model.
* predict() predicts the cluster of new data.
* fit_predict() trains the model and predicts together.
* cluster_centers_ returns the centroid of each cluster.

---

# 18. Interview Questions and Answers

### 1. What is Clustering?

Clustering is the process of grouping similar data points together without using labels.

---

### 2. What is Unsupervised Learning?

Unsupervised Learning is a machine learning technique that learns hidden patterns from unlabeled data.

---

### 3. What is K-Means?

K-Means is an unsupervised machine learning algorithm that divides data into K clusters.

---

### 4. What does K represent?

K represents the number of clusters.

---

### 5. What is a Centroid?

A centroid is the center point (average) of all the data points in a cluster.

---

### 6. Does K-Means require labeled data?

No. K-Means works only with unlabeled data.

---

### 7. What does fit() do?

It trains the K-Means model using the given dataset.

---

### 8. What does predict() do?

It predicts which cluster a new data point belongs to.

---

### 9. What does fit_predict() do?

It trains the model and immediately returns the cluster labels.

---

### 10. What is cluster_centers_?

It returns the centroid of every cluster.

---

### 11. What is labels_?

It returns the cluster assigned to every data point.

---

### 12. What is Customer Segmentation?

Customer Segmentation is the process of dividing customers into groups with similar characteristics.

---

### 13. Why is K-Means popular?

Because it is simple, fast, efficient, and easy to implement.

---

### 14. What happens if K is too small?

Different groups may merge into the same cluster.

---

### 15. What happens if K is too large?

The data may be divided into unnecessary small clusters.

---

### 16. Name some applications of clustering.

* Customer Segmentation
* Fraud Detection
* Recommendation Systems
* Healthcare
* Marketing

---

### 17. What are the limitations of K-Means?

* Must choose K beforehand.
* Sensitive to outliers.
* Doesn't work well for irregular cluster shapes.

---

### 18. What is the difference between fit() and fit_predict()?

* fit() trains the model.
* fit_predict() trains the model and returns cluster labels.

---

### 19. How can you choose the value of K?

Common methods include:

* Elbow Method
* Silhouette Score
* Domain Knowledge

---

### 20. Why is clustering useful?

Clustering helps discover hidden patterns, segment customers, improve recommendations, and support business decision-making.

---

# 19. Summary

* Clustering is an Unsupervised Learning technique.
* K-Means groups similar data into K clusters.
* No labeled data is required.
* Centroids represent the center of each cluster.
* K-Means is widely used in customer segmentation, recommendation systems, banking, healthcare, and marketing.
* Important methods include:

  * `fit()`
  * `predict()`
  * `fit_predict()`
  * `cluster_centers_`
  * `labels_`
