# Gradient Descent Simulator

loss = 100
learning_rate = 0.05

for epoch in range(20):

    gradient = loss

    new_loss = (loss - learning_rate * gradient )

    improvement = ((loss - new_loss) / loss) * 100

    loss = new_loss

    print(f"""
        Epoch: {epoch + 1}
        Loss: {loss:.2f}
        Improvement: {improvement:.2f}%
        """)