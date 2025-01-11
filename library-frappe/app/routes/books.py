from fastapi import APIRouter, HTTPException
from models import books, Book # type: ignore
from supabase import Client
from .database import get_supabase_client

router = APIRouter()
supabase: Client = get_supabase_client()

@router.get("/")
def get_all_books():
    books = supabase.table("books").select("*").execute()
    return books.data
    # return books

@router.post("/")
def add_book(book: Book):
    existing_book = supabase.table("books").select("*").eq("id", book.id).execute()
    
    # if books are empty
    if existing_book.data:
        raise HTTPException(status_code=400, detail="Book with this ID already exists.")
    supabase.table("books").insert({
        "id": book.id,
        "name": book.name,
        "author": book.author,
        "stock": book.stock
    }).execute()
    
    return {"message": "Book added successfully", "data": book}

    # for b in books:
    #     if b.id == book.id:
    #         raise HTTPException(status_code=400, detail="Book with this ID already exists.")
    # books.append(book)
    # return {"message": "Book added successfully", "data": book}

@router.get("/{book_id}")
def get_book(book_id: int):
    book = supabase.table("books").select("*").eq("id", book_id).execute()
    if not book.data:
        raise HTTPException(status_code=404, detail="Book not found.")
    return book.data[0]

    # for book in books:
    #     if book.id == book_id:
    #         return book
    # raise HTTPException(status_code=404, detail="Book not found.")
