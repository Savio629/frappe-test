import React, { useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import BookTable from "./components/BookTable";
import MemberTable from "./components/MemberTable";
import IssueBookForm from "./components/IssueBookForm";
import ReturnBookForm from "./components/ReturnBookForm";
import TransactionTable from "./components/TransactionTable";

const API_BASE_URL = "http://127.0.0.1:8000";

const App = () => {
  const [tab, setTab] = useState(0);
  const [message, setMessage] = useState("");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setMessage(""); // Clear the message when the tab changes
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom sx={{ paddingTop: 4 }}>
        Library Management Console
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Books" />
        <Tab label="Members" />
        <Tab label="Transactions" />
      </Tabs>

      {tab === 0 && <BookTable setMessage={setMessage} />}
      {tab === 1 && <MemberTable setMessage={setMessage} />}
      {tab === 2 && (
        <Box mt={4}>
          <IssueBookForm setMessage={setMessage} />
          <ReturnBookForm setMessage={setMessage} />
          <TransactionTable setMessage={setMessage} />
        </Box>
      )}

      {message && (
        <Typography variant="body1" color="secondary" mt={2}>
          <strong>{message}</strong>
        </Typography>
      )}
    </Container>
  );
};

export default App;