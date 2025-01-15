from fastapi import APIRouter, HTTPException
from models import books, members, transactions # type: ignore
from supabase import Client
from .database import get_supabase_client

router = APIRouter()
supabase: Client = get_supabase_client()

@router.post("/issue")
def issue_book(book_id: int, member_id: int):
    book = supabase.table("books").select("*").eq("id", book_id).execute()
    member = supabase.table("members").select("*").eq("id", member_id).execute()
    
    if not book.data or book.data[0]["stock"] <= 0:
        raise HTTPException(status_code=400, detail="Book not available.")
    if not member.data:
        raise HTTPException(status_code=404, detail="Member not found.")
    if member.data[0]["outstanding_debt"] > 500:
        raise HTTPException(status_code=400, detail="Member has outstanding debt over Rs. 500.")
    
    supabase.table("books").update({"stock": book.data[0]["stock"] - 1}).eq("id", book_id).execute()
    
    supabase.table("transactions").insert({
        "book_id": book_id,
        "member_id": member_id,
        "type": "issue"
    }).execute()
    
    book_name = book.data[0]["name"]
    member_name = member.data[0]["name"]
    return {"message": f"{member_name} issued {book_name} successfully"}
    # book = next((b for b in books if b.id == book_id), None)
    # if not book or book.stock <= 0:
    #     raise HTTPException(status_code=400, detail="Book not available.")

    # member = next((m for m in members if m.id == member_id), None)
    # if not member:
    #     raise HTTPException(status_code=404, detail="Member not found.")
    # if member.outstanding_debt > 500:
    #     raise HTTPException(status_code=400, detail="Member has outstanding debt over Rs. 500.")

    # book.stock -= 1
    # transactions.append({"book_id": book_id, "member_id": member_id, "type": "issue"})
    # return {"message": "Book issued successfully"}


@router.post("/return")
def return_book(book_id: int, member_id: int, rent_fee: int):
    book = supabase.table("books").select("*").eq("id", book_id).execute()
    member = supabase.table("members").select("*").eq("id", member_id).execute()

    if not book.data:
        raise HTTPException(status_code=404, detail="Book not found.")
    if not member.data:
        raise HTTPException(status_code=404, detail="Member not found.")
    
    # Increase book stock
    supabase.table("books").update({"stock": book.data[0]["stock"] + 1}).eq("id", book_id).execute()
    
    # Update member debt
    supabase.table("members").update({"outstanding_debt": member.data[0]["outstanding_debt"] + rent_fee}).eq("id", member_id).execute()
    
    # Log the transaction
    supabase.table("transactions").insert({
        "book_id": book_id,
        "member_id": member_id,
        "type": "return",
        "fee": rent_fee
    }).execute()
    
    book_name = book.data[0]["name"]
    member_name = member.data[0]["name"]
    return {"message": f"{member_name} returned {book_name} successfully"}

    # book = next((b for b in books if b.id == book_id), None)
    # if not book:
    #     raise HTTPException(status_code=404, detail="Book not found.")

    # member = next((m for m in members if m.id == member_id), None)
    # if not member:
    #     raise HTTPException(status_code=404, detail="Member not found.")

    # book.stock += 1
    # member.outstanding_debt += rent_fee
    # transactions.append({"book_id": book_id, "member_id": member_id, "type": "return", "fee": rent_fee})
    # return {"message": "Book returned successfully"}