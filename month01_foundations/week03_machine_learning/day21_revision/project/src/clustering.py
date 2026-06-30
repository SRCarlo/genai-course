import pandas as pd
from sklearn.cluster import KMeans

# Load data
data = pd.read_csv("../data/clustering_data.csv")

X = data[["Age", "Income"]]

# Train model
model = KMeans(n_clusters=3, random_state=42)

data["Cluster"] = model.fit_predict(X)

print(data)