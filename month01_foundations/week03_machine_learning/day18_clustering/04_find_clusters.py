import pandas as pd

from sklearn.cluster import KMeans

df = pd.read_csv("data/customer_data.csv")

model = KMeans(
    n_clusters=2,
    random_state=42
)

model.fit(df)

print(model.labels_)