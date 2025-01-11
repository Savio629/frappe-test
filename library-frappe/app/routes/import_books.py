import requests
from fastapi import APIRouter, HTTPException

from supabase import Client
from .database import get_supabase_client

router = APIRouter()
supabase: Client = get_supabase_client()

# In-memory storage
books = []

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
    for book in books_data:
        existing_book = supabase.table("books").select("*").eq("id", book["bookID"]).execute()
        if not existing_book.data:
            supabase.table("books").insert({
                "id": book["bookID"],
                "name": book["title"],
                "author": book["authors"],
                "stock": book.get("bookStock", 0)
            }).execute()
            added_books.append(book["title"])

    return {"message": f"Books {', '.join(added_books)} imported successfully."}

        # if not any(b['id'] == book["bookID"] for b in books):
        #     new_book = {
        #         "id": book["bookID"],
        #         "name": book["title"],
        #         "author": book["authors"],
        #         "stock": 10  # Default stock value
        #     }
        #     books.append(new_book)
        #     added_books.append(new_book)

    # return {"message": f"{len(added_books)} books imported successfully.", "books": [b["name"] for b in added_books]}


