text = "Hello AI"

characters = sorted(set(text))

char_to_index = {
    ch: idx
    for idx, ch in enumerate(characters)
}

index_to_char = {
    idx: ch
    for ch, idx in char_to_index.items()
}

print(char_to_index)