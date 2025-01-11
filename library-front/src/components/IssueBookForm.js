import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

const API_BASE_URL = "http://127.0.0.1:8000";

const IssueBookForm = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const handleIssueBook = async () => {
    setLoading(true);
    setMessage(""); 
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/issue?book_id=${bookId}&member_id=${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Book issued successfully.");
        setBookId("");
        setMemberId("");
      } else {
        setMessage(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail) || "Failed to issue book.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Issue Book</Typography>
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Book ID"
          variant="outlined"
          size="small"
          onChange={(e) => setBookId(e.target.value)}
        />
        <TextField
          label="Member ID"
          variant="outlined"
          size="small"
          onChange={(e) => setMemberId(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleIssueBook}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Issue Book"}
        </Button>
      </Box>
    </Box>
  );
};

export default IssueBookForm;