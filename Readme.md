# Library Management System

This repository contains the frontend and backend code for a Library Management System for Dev Hiring Test. The backend is built using FastAPI, and the frontend is developed using React.

### 🌐 Live Links

**Frontend: https://frappe-test.netlify.app/**

**Backend: https://frappe-test.onrender.com/**

## Table of Contents

- [Backend Setup](#backend-setup)
- [Database Schema](#database-schema)
- [Frontend Setup](#frontend-setup)
- [References](#references)

## Backend Setup

### Prerequisites

Make sure you have Python installed on your machine. You can download it from [python.org](https://www.python.org/downloads/).

### Create a Virtual Environment

To create a virtual environment, run the following command:

```
python -m venv venv
```

### Activate the Virtual Environment

For Windows:

```
venv\Scripts\activate
```

For macOS/Linux:

```
source venv/bin/activate
```

### Install Dependencies

Install the required packages using pip:

```
pip install fastapi uvicorn pydantic supabase
```

### Database Schema

The following SQL commands create the necessary tables for the application:

```
CREATE TABLE books (
    id SERIAL PRIMARY KEY,        -- Unique ID for each book
    name VARCHAR(255) NOT NULL,   -- Name of the book
    author VARCHAR(255) NOT NULL, -- Author of the book
    stock INT NOT NULL DEFAULT 0  -- Stock available for the book
);
```

```
CREATE TABLE members (
    id SERIAL PRIMARY KEY,                -- Unique ID for each member
    name VARCHAR(255) NOT NULL,           -- Name of the member
    outstanding_debt INT DEFAULT 0        -- Outstanding debt of the member
);
```

```
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,             -- Unique ID for each transaction
    book_id INT NOT NULL,              -- Foreign key referencing the books table
    member_id INT NOT NULL,            -- Foreign key referencing the members table
    type VARCHAR(50) NOT NULL,         -- Type of transaction: 'issue' or 'return'
    fee INT DEFAULT 0,                 -- Rent fee (only for return transactions)
    created_at TIMESTAMP DEFAULT NOW(),-- Timestamp for when the transaction was created
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
```

## Frontend Setup

### Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Install Dependencies

Navigate to the frontend directory and install the required packages:

```
npm install
```
## Running the Application

### Start the Frontend

To start the React development server, run:

```
npm start
```

This will start the frontend application, and you can access it in your web browser at 
```
http://localhost:3000
```

### Start the Backend

To start the FastAPI backend, run the following command in the terminal:

```
uvicorn main:app --port 8000
```

This will start the backend server on 
```
http://localhost:8000
```

.

### Access Swagger Documentation

You can access the Swagger documentation for the API at the following URL:

```
http://localhost:8000/docs
```

This documentation provides an interactive interface to test the API endpoints.

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs/reference/python/introduction)