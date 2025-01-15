import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MemberTable = ({ setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMember, setNewMember] = useState({ id: "", name: "", outstanding_debt: "" });

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

  const handleAddMember = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });
      if (response.ok) {
        setMessage("Member added successfully!");
        fetchMembers();
        setOpen(false);
        setNewMember({ id: "", name: "", outstanding_debt: "" });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)} >
        Add Member
      </Button>

      <Button variant="contained" color="primary" onClick={fetchMembers} disabled={loading} style={{ marginLeft: "10px" }}>
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            value={newMember.id}
            onChange={(e) => setNewMember({ ...newMember, id: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Outstanding Debt"
            value={newMember.outstanding_debt}
            onChange={(e) => setNewMember({ ...newMember, outstanding_debt: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMember} color="primary">
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MemberTable;
