import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const API_BASE_URL = "http://127.0.0.1:8000";

const MemberTable = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/members/`);
      const data = await response.json();
      if (response.ok) {
        setMembers(data || []);
      } else {
        setMessage("Failed to fetch members.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={fetchMembers} disabled={loading}>
        {loading ? "Loading..." : "Refresh Members"}
      </Button>
      {members.length > 0 ? (
        <Table mt={4}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Outstanding Debt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.outstanding_debt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No members available.</Typography>
      )}
    </div>
  );
};

export default MemberTable;