import math


def cosine_similarity(a, b):

    dot_product = 0
    magnitude_a = 0
    magnitude_b = 0


    for i in range(len(a)):

        dot_product += a[i] * b[i]

        magnitude_a += a[i] ** 2

        magnitude_b += b[i] ** 2


    return dot_product / (
        math.sqrt(magnitude_a)
        *
        math.sqrt(magnitude_b)
    )


if __name__ == "__main__":

    a = [1, 2, 3]

    b = [1, 2, 4]


    print(
        cosine_similarity(a, b)
    )