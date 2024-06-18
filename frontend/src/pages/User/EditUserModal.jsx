import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const roles = ["Manager", "Employee"]; // Define available roles

const EditUserModal = ({ open, handleClose, userId }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Fetch user data for editing on component mount
  useEffect(() => {
    if (open && userId) {
      // Fetch user details from API using userId
      axios
        .get(`http://localhost:4000/api/users/${userId}`)
        .then((response) => {
          const userData = response.data;
          setEmail(userData.email);
          setSelectedRoles(userData.role);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Handle error if needed
        });
    }
  }, [open, userId]);

  const handleRoleChange = (event) => {
    setSelectedRoles(event.target.value);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info

  const handleOpenSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      email: email,
      password: password,
      role: selectedRoles,
    };
    console.log(user)
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/users/${userId}`,
        user
      );
      setOpenSnackbar(true);
      handleOpenSnackbar("User updated successfully!", "success");
      // Reset form fields and close modal
      setPassword("");
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
      setOpenSnackbar(true);
      handleOpenSnackbar(error.response.data.mssg, "error");
      // Reset form fields and close modal
      setPassword("");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-user-modal-title"
        aria-describedby="edit-user-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="edit-user-modal-title">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Select Role(s)</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                multiple
                value={selectedRoles}
                onChange={handleRoleChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((role) => (
                      <Chip key={role} label={role} />
                    ))}
                  </Box>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Update User
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duration in milliseconds (optional)
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position on the screen
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity} // success, error, warning, info
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditUserModal;
