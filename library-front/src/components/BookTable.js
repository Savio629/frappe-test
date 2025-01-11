import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const API_BASE_URL = "http://127.0.0.1:8000";

const BookTable = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/`);
      const data = await response.json();
      if (response.ok) {
        setBooks(data || []);
      } else {
        setMessage("Failed to fetch books.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={fetchBooks} disabled={loading}>
        {loading ? "Loading..." : "Refresh Books"}
      </Button>
      {books.length > 0 ? (
        <Table mt={4}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No books available.</Typography>
      )}
    </div>
  );
};

export default BookTable;