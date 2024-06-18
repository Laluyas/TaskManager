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

const categories = ["Work", "Personal", "Study", "Others"]; // Define available categories
const priorities = ["High", "Medium", "Low"]; // Define priority levels
const statuses = ["Pending", "In Progress", "Completed"]; // Define status options

const OpenTaskModal = ({ open, handleClose, taskId }) => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low"); // Default priority
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Pending"); // Default status
  const [assignedTo, setAssignedTo] = useState([]); // State to hold selected users (array of user objects)
  const [users, setUsers] = useState([]); // State to hold users list with id and email

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/tasks/${taskId}`
        );
        const taskData = response.data; // Assuming response.data is an object with task details
        console.log(taskData);
        if (taskData) {
          setTitle(taskData.title);
          setDescription(taskData.description);
          setDueDate(new Date(taskData.dueDate).toISOString().substring(0, 10));
          setPriority(priorities[taskData.priority - 1]); // Adjust priority based on taskData.priority
          setCategory(taskData.category);
          setStatus(taskData.status);
          const assignedEmails = []
          taskData.users.map((user)=>{
            assignedEmails.push(user.email);
          })
          setAssignedTo(assignedEmails);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        // Handle error, show error message or feedback to the user
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users");
        const userData = response.data; // Assuming response.data is an array of user objects
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error, show error message or feedback to the user
      }
    };

    if (open && taskId) {
      fetchTask();
      fetchUsers();
    }
  }, [open, taskId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Map selected emails to user IDs
    const selectedUserIDs = assignedTo.map((user) => user._id);

    const taskData = {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priorities.indexOf(priority) + 1, // Map priority string to numeric value
      category: category,
      status: status,
      assignedTo: selectedUserIDs, // Array of selected user IDs
    };

    console.log("Task data:", taskData);

    // Example of submitting taskData to backend
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/tasks/${taskId}`,
        taskData
      );
      console.log("Task updated:", response.data);
      // Optionally, you can add success feedback or close the modal here
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error, show error message or feedback to the user
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-task-modal-title"
      aria-describedby="edit-task-modal-description"
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
        <h2 id="edit-task-modal-title">Track Task</h2>
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
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled
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
                disabled
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
                  disabled
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
                  disabled
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
                disabled
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
            Update Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default OpenTaskModal;
