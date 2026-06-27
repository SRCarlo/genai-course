import pandas as pd
from sklearn.cluster import KMeans

# Load the dataset
df = pd.read_csv("data/customer_data.csv")

# Create and train the model
model = KMeans(
    n_clusters=2,
    random_state=42
)

model.fit(df)

# New customer data
new_customer = pd.DataFrame(
    [[25, 32000]],
    columns=df.columns
)

# Predict the cluster
prediction = model.predict(new_customer)

print("Predicted Cluster:", prediction[0])