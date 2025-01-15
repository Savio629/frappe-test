import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TransactionTable = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
    //   const response = await fetch(`${API_BASE_URL}/transactions/`);
    //   const data = await response.json();
    //   if (response.ok) {
    //     setTransactions(data || []);
    //   } else {
    //     setMessage("Failed to fetch transactions.");
    //   }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      {transactions.length > 0 ? (
        <Table mt={4}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.member}</TableCell>
                <TableCell>{transaction.book}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography></Typography>
      )}
    </div>
  );
};

export default TransactionTable;