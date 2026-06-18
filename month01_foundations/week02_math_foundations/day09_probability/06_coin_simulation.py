# Simulating probability using Python.

import random

for i in range(10):
    
    toss = random.choice(
        [
            "Head",
            "Tail"
        ]
    )
    
    print(toss)