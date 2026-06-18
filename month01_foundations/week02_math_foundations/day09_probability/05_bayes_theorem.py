# Bayes Theorem 
    # Bayes helps update beliefs using new information.
    

prior = 0.10

likelihood = 0.90

evidence = 0.20

posterior = (
    likelihood *
    prior
) / evidence

print(posterior)