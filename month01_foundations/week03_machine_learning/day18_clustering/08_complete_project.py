import pandas as pd
from sklearn.cluster import KMeans

# Load data
df = pd.read_csv("data/customer_data.csv")

# Keep only features for training
X = df[["age", "salary"]]

# Create model
model = KMeans(
    n_clusters=2,
    random_state=42
)

# Train model
df["Cluster"] = model.fit_predict(X)

print("\nCustomer Segments\n")
print(df)

# User input
age = int(input("\nEnter Age: "))
salary = int(input("Enter Salary: "))

# Create DataFrame with the same feature names
new_customer = pd.DataFrame(
    {
        "age": [age],
        "salary": [salary]
    }
)

# Predict cluster
prediction = model.predict(new_customer)

print("\nCustomer belongs to Cluster:", prediction[0])