query = "sat"

keys = [
    "cat",
    "mat",
    "the"
]

values = [
    "animal",
    "object",
    "article"
]

for k,v in zip(keys, values):
    print(query, "->", k, "=", v)