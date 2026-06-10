# ASSIGNMENT (Library Management)

books = []

def add_book(title, author):
    book = {
        "title": title,
        "author": author
    }
    books.append(book)
    
def show_books():
    for book in books:
        print(book)

def delete_book(title):
    for book in books:
        if book["title"] == title:
            books.remove(book)
            
# Add books 
add_book("Python", "Jhon")
add_book("AI Basics", "David")

# Show books
print("Books:")
show_books()

# Delete a book
delete_book("Python")

# Show book after deletion
print("\nAfter Deletion:")
show_books()

# Count books
print("\nTotal Books:", len(books))