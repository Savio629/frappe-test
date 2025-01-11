from fastapi import APIRouter, HTTPException
from models import members, Member #type: ignore
from supabase import Client
from .database import get_supabase_client

router = APIRouter()
supabase: Client = get_supabase_client()

@router.get("/")
def get_all_members():
    members = supabase.table("members").select("*").execute()
    return members.data
    # return members

@router.post("/")
def add_member(member: Member):
    # for m in members:
    #     if m.id == member.id:
    #         raise HTTPException(status_code=400, detail="Member with this ID already exists.")
    # members.append(member)
    # return {"message": "Member added successfully", "data": member}
    existing_member = supabase.table("members").select("*").eq("id", member.id).execute()
    if existing_member.data:
        raise HTTPException(status_code=400, detail="Member with this ID already exists.")
    
    supabase.table("members").insert({
        "id": member.id,
        "name": member.name,
        "outstanding_debt": member.outstanding_debt
    }).execute()
    
    return {"message": "Member added successfully", "data": member}


@router.get("/{member_id}")
def get_member(member_id: int):
    # for member in members:
    #     if member.id == member_id:
    #         return member
    # raise HTTPException(status_code=404, detail="Member not found.")
    member = supabase.table("members").select("*").eq("id", member_id).execute()
    if not member.data:
        raise HTTPException(status_code=404, detail="Member not found.")
    return member.data[0]
