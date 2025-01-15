import requests
from fastapi import APIRouter, HTTPException
from supabase import Client
from .database import get_supabase_client

router = APIRouter()
supabase: Client = get_supabase_client()

FRAPPE_API_URL = "https://frappe.io/api/method/frappe-library"

@router.post("/")
def import_books(page: int = 1, title: str = None, authors: str = None):
    params = {"page": page}
    if title:
        params["title"] = title
    if authors:
        params["authors"] = authors

    try:
        response = requests.get(FRAPPE_API_URL, params=params)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from Frappe API: {str(e)}")

    books_data = response.json().get("message", [])
    if not books_data:
        return {"message": "No books found for the given parameters."}

    added_books = []
    updated_books = []
    for book in books_data:
        book_id = book["bookID"]
        book_title = book["title"]
        book_author = book["authors"]
        book_stock = book.get("bookStock", 1)

        existing_book = supabase.table("books").select("*").eq("id", book_id).execute()

        if existing_book.data:
            current_stock = existing_book.data[0]["stock"]
            new_stock = current_stock + book_stock
            supabase.table("books").update({"stock": new_stock}).eq("id", book_id).execute()
            updated_books.append(book_title)
        else:
            supabase.table("books").insert({
                "id": book_id,
                "name": book_title,
                "author": book_author,
                "stock": book_stock
            }).execute()
            added_books.append(book_title)

    return {
        "message": f"{len(added_books)} books added, {len(updated_books)} books updated.",
        "added_books": added_books,
        "updated_books": updated_books,
    }
