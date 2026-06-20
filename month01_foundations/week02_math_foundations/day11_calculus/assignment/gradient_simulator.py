"""
Day 11 Assignment
Gradient Simulator

Requirements:
1. Initial Loss = 100
2. Reduce by 8 each epoch
3. Run 10 epochs
4. Display:
   - Epoch
   - Current Loss
5. Bonus:
   - Show percentage improvement
"""

initial_loss = 100
loss = initial_loss


print("\n_________________GRADIENT DESCENT SIMULATOR________________\n")


for epoch in range(1, 11):

    loss -= 8

    improvement = ( (initial_loss - loss) / initial_loss ) * 100

    print(f"""
Epoch: {epoch}
Current Loss: {loss}
Improvement: {improvement:.2f}%
    """)
