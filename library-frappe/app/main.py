from fastapi import FastAPI
from routes import books, members, transactions, import_books # type: ignore
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frappe-test.netlify.app", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(members.router, prefix="/members", tags=["Members"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(import_books.router, prefix="/import", tags=["Import Books"])



