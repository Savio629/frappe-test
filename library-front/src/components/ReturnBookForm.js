import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ReturnBookForm = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [returnBookId, setReturnBookId] = useState("");
  const [returnMemberId, setReturnMemberId] = useState("");
  const [rentFee, setRentFee] = useState("");


  const handleReturnBook = async () => {
    setLoading(true);
    setMessage(""); 
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/return?book_id=${returnBookId}&member_id=${returnMemberId}&rent_fee=${parseInt(rentFee, 10)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Book returned successfully.");
        setReturnBookId("");
        setReturnMemberId("");
        setRentFee("");
      } else {
        setMessage(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail) || "Failed to return book.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Return Book</Typography>
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Book ID"
          variant="outlined"
          size="small"
          onChange={(e) => setReturnBookId(e.target.value)}
        />
        <TextField
          label="Member ID"
          variant="outlined"
          size="small"
          onChange={(e) => setReturnMemberId(e.target.value)}
        />
        <TextField
          label="Rent Fee"
          variant="outlined"
          size="small"
          onChange={(e) => setRentFee(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleReturnBook}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Return Book"}
        </Button>
      </Box>
    </Box>
  );
};

export default ReturnBookForm;