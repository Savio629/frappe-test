from pydantic import BaseModel

class Book(BaseModel):
    id: int
    name: str
    author: str
    stock: int

class Member(BaseModel):
    id: int
    name: str
    outstanding_debt: int = 0

books = []
members = []
transactions = []
