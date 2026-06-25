import pandas as pd
from sklearn.linear_model import LinearRegression

# Dataset
data = {
    "size": [500, 1000, 1500, 2000, 2500],
    "price": [100000, 200000, 300000, 400000, 500000]
}

df = pd.DataFrame(data)

# Features & Target
X = df[["size"]]
y = df["price"]

# Model
model = LinearRegression()
model.fit(X, y)

# User Input
size = float(input("Enter house size (sq ft): "))

# Prediction
prediction = model.predict([[size]])

print(f"""
Predicted House Price:

₹{prediction[0]:,.2f}
""")