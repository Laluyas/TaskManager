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
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const categories = ["Work", "Personal", "Study", "Others"]; // Define available categories
const priorities = ["High", "Medium", "Low"]; // Define priority levels
const statuses = ["Pending", "In Progress", "Completed"]; // Define status options

const AddTaskModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low"); // Default priority
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Pending"); // Default status
  const [assignedTo, setAssignedTo] = useState([]); // State to hold selected users
  const [users, setUsers] = useState([]); // State to hold users list with id and email

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://taskserver-99hb.onrender.com/api/users");
        console.log("Users list:", response.data);
        setUsers(response.data); // Set the fetched users into state
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error, show error message or feedback to the user
      }
    };

    if (open) {
      // Fetch users only when the modal is opened
      fetchUsers();
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Map selected emails to user IDs
    const selectedUserIDs = assignedTo
      .map((email) => {
        const user = users.find((user) => user.email === email);
        return user ? user._id : null; // Return user ID or null if user is not found
      })
      .filter((id) => id !== null); // Filter out null values (optional, depending on your backend requirement)

    console.log(selectedUserIDs);

    const taskData = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priorities.indexOf(priority) + 1, // Map priority string to numeric value
      category: category,
      status: status,
      user_ids: selectedUserIDs, // Array of selected user IDs
    };

    console.log("Task data:", taskData);

    //Example of submitting taskData to backend
    try {
      const response = await axios.post(
        "https://taskserver-99hb.onrender.com/api/tasks",
        taskData
      );
      console.log("Task created:", response.data);
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage(response.data.mssg); // Set success message from response
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response.data.mssg); // Set success message from response
      handleClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-task-modal-title"
        aria-describedby="create-task-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%", // 90% width on extra small screens
              sm: "80%", // 80% width on small screens
              md: "60%", // 60% width on medium screens
              lg: "50%", // 50% width on large screens
              xl: 800, // 800px width on extra large screens
            },
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="create-task-modal-title">Create New Task</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* First Column */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Due Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {priorities.map((priorityOption) => (
                      <MenuItem key={priorityOption} value={priorityOption}>
                        {priorityOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Second Column */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((categoryOption) => (
                      <MenuItem key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statuses.map((statusOption) => (
                      <MenuItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Assigned To */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  id="assignedTo"
                  options={users.map((user) => user.email)} // Use emails as options
                  value={assignedTo}
                  onChange={(event, newValue) => {
                    setAssignedTo(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Assigned To"
                      placeholder="Select Users"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Create Task
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity} // Severity can be success, error, warning, info
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddTaskModal;