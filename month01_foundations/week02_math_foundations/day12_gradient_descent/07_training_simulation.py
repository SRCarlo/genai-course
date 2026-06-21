# Mini Training Loop

loss = 100

learning_rate = 0.1

for epoch in range(10):
    gradient = loss * 0.1
    
    loss = (loss - learning_rate * gradient)
    
    print(f"""
          Epoch: {epoch+1}
          Loss: {loss}
          """)