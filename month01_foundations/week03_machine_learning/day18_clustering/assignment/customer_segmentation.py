import pandas as pd
from sklearn.cluster import KMeans

# Load Dataset
df = pd.read_csv("../data/shopping_data.csv")

print("\n_________________ CUSTOMER DATA _________________\n")
print(df)


# Train K-Means Model
model = KMeans(
    n_clusters=3,
    random_state=42
)

df["Cluster"] = model.fit_predict(df)


# Display Customer Segments
print("\n___________________CUSTOMER SEGMENTS _____________________\n")
print(df)

# Display Cluster Centers
print("\n___________________ CLUSTER CENTERS _________________\n")

centers = model.cluster_centers_

for i, center in enumerate(centers):
    print(f"Cluster {i}:")
    print(f"Age: {center[0]:.2f}")
    print(f"Salary: {center[1]:.2f}")
    print(f"Spending Score: {center[2]:.2f}")
    print()

# Predict New Customer
print("\n_________________ NEW CUSTOMER _________________\n")

age = int(input("Enter Age: "))
salary = int(input("Enter Salary: "))
spending = int(input("Enter Spending Score: "))

prediction = model.predict([[age, salary, spending]])

cluster = prediction[0]

print("\nCustomer belongs to Cluster:", cluster)


# Cluster Meaning
print("\n___________________ CUSTOMER TYPE __________________\n")

cluster_names = {
    0: "Budget Customers",
    1: "Premium Customers",
    2: "Luxury Customers"
}

print(cluster_names.get(cluster, "Unknown Cluster"))