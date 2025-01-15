import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookTable = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [manualAddDialogOpen, setManualAddDialogOpen] = useState(false);
  const [importParams, setImportParams] = useState({
    page: 1,
    author: "",
    title: "",
  });
  const [newBook, setNewBook] = useState({
    id: "",
    name: "",
    author: "",
    stock: "",
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/`);
      const data = await response.json();
      if (response.ok) {
        setBooks(data.reverse() || []); // Reverse the order of books
      } else {
        setMessage("Failed to fetch books.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const importBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/import/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importParams),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Books imported successfully.");
        fetchBooks(); // Refresh books after import
      } else {
        setMessage("Failed to import books.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addBookManually = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Book added successfully.");
        fetchBooks(); // Refresh books after adding
      } else {
        setMessage("Failed to add book.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setManualAddDialogOpen(false); // Close the dialog
    }
  };

  const handleInputChange = (field, setter) => (event) => {
    setter((prev) => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
      <div className="button-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center",   marginBottom: "1rem"}}>
  <div className="left-buttons" style={{ display: "flex",  gap: "30px" }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => setAddDialogOpen(true)}
    >
      Add Books
    </Button>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => setAddDialogOpen(true)}
    >
      Import Books
    </Button>
  </div>
  <div className="right-button" style={{  marginLeft: "auto"}}>
    <Button
      variant="contained"
      color="primary"
      onClick={fetchBooks}
      disabled={loading}
    >
      {loading ? "Loading..." : "Refresh Books"}
    </Button>
  </div>
</div>
      </div>

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

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Books</DialogTitle>
        <DialogContent>
          <Typography>How would you like to add books?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualAddDialogOpen(true)} color="primary">
            Add Manually
          </Button>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Add Dialog */}
      <Dialog open={manualAddDialogOpen} onClose={() => setManualAddDialogOpen(false)}>
        <DialogTitle>Add Book Manually</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            type="text"
            fullWidth
            value={newBook.id}
            onChange={handleInputChange("id", setNewBook)}
          />
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newBook.name}
            onChange={handleInputChange("name", setNewBook)}
          />
          <TextField
            margin="dense"
            label="Author"
            type="text"
            fullWidth
            value={newBook.author}
            onChange={handleInputChange("author", setNewBook)}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={newBook.stock}
            onChange={handleInputChange("stock", setNewBook)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addBookManually} color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookTable;
