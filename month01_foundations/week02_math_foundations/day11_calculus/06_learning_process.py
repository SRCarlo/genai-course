'''
How AI Learns:

Training Data
      ↓
Prediction
      ↓
Loss
      ↓
Gradient
      ↓
Update Weights
      ↓
Better Prediction

'''

loss = 50

for epoch in range(5):

    loss -= 5

    print( f"Epoch {epoch+1}: Loss={loss}" )
