import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import AddTaskModal from "./AddTaskModal";
import { Button } from "@mui/material";
import EditTaskModal from "./EditTaskModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Task_Overview = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to hold selected Task ID

  const [openAddModal, setAddOpenModal] = useState(false);
  const [openEditModal, setEditOpenModal] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  

  const handleAddOpenModal = () => {
    setAddOpenModal(true);
  };

  const handleAddCloseModal = () => {
    setAddOpenModal(false);
  };

  const handleEditOpenModal = () => {
    setEditOpenModal(true);
  };

  const handleEditCloseModal = () => {
    setEditOpenModal(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const CustomEditButtonComponent = ({ data }) => {
    const handleEdit = () => {
      setSelectedTaskId(data._id);
      handleEditOpenModal();
    };

    return (
      <Button variant="contained" color="success" onClick={handleEdit}>
        Edit
      </Button>
    );
  };

  const CustomDeleteButtonComponent = ({ data }) => {
    const handleDelete = () => {
      // Make sure to replace 'http://localhost:4000' with your actual backend URL
      axios
        .delete(`https://taskserver-99hb.onrender.com/api/tasks/${data._id}`)
        .then((response) => {
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Delete successful for task row with ID: " + data._id); // Set success message from response
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Delete failed for task row with ID: " + data._id); // Set success message from response
        });
    };

    return (
      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete
      </Button>
    );
  };

  // Custom date formatter function
  const dateFormatter = (params) => {
    // Assuming params.value is in ISO format like "2024-06-15T12:00:00Z"
    const dateObj = new Date(params.value);
    return dateObj.toLocaleDateString(); // Customize the format using toLocaleDateString options
  };

  // Priority formatter function
  const priorityFormatter = (params) => {
    switch (params.value) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "";
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "title", filter: true },
    { field: "description", filter: true },
    { field: "dueDate", filter: true, valueFormatter: dateFormatter },
    { field: "priority", filter: true, valueFormatter: priorityFormatter },
    { field: "status", filter: true },
    //{ field: "category", filter: true },
    {
      headerName: "Assigned To",
      field: "users",
      filter: true,
      flex: 1,
      cellRendererFramework: ({ value }) => (
        <ul style={{ padding: 0, margin: 0 }}>
          {value.map((user) => (
            <li key={user._id}>{user.email}</li>
          ))}
        </ul>
      ),
    },
    { headerName: "Edit", cellRenderer: CustomEditButtonComponent },
    { headerName: "Delete", cellRenderer: CustomDeleteButtonComponent },
  ]);

  // Fetch task details with Axios
  useEffect(() => {
    axios
      .get("https://taskserver-99hb.onrender.com/api/tasks/") // Replace with your API endpoint
      .then((response) => {
        // Map over response data and format 'users' field if needed
        const formattedData = response.data.map((task) => ({
          ...task,
          users: task.users.map((user) => user.email), // Assuming 'users' field contains an array of user objects
        }));
        setRowData(formattedData);
        console.log(response.data);
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Tasks loaded from Database successfully"); // Set success message from response
      })
      .catch((error) => {
        console.error("There was an error fetching the task data!", error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "There was an error fetching the task data from Database!"
        ); // Set error message from response
      });
  }, []);

  // Pagination settings
  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  return (
    <>
      <Container>
        <Row>
          <center>
              <h2 style={{ margin: "10px 0" }}>Task Overview</h2>
          </center>  
        </Row>
        <Row>
          <div className="d-flex justify-content-end">
            <Button
              variant="contained"
              color="primary"
              className="mx-5 my-2"
              onClick={handleAddOpenModal}
            >
              New Task
            </Button>
          </div>
        </Row>
        <Row>
          <Col>
            <div
              className="ag-theme-quartz-dark" // applying the grid theme
              style={{ height: 600 }} // the grid will fill the size of the parent container
            >
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
              />
            </div>
          </Col>
        </Row>
      </Container>
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
      <AddTaskModal open={openAddModal} handleClose={handleAddCloseModal} />
      <EditTaskModal
        open={openEditModal}
        handleClose={handleEditCloseModal}
        taskId={selectedTaskId}
      />
      {/* Render other components related to task management */}
    </>
  );
};

export default Task_Overview;