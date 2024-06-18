import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Container, Row } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import AddUserModal from "../User/AddUserModal"; // Import your modal component
import { Button } from "@mui/material";
import EditUserModal from "../User/EditUserModal";

// User Management Component
const User_Management = () => {
  const [rowData, setRowData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [AddopenModal, setAddOpenModal] = useState(false); // State for modal open/close
  const [EditopenModal, setEditOpenModal] = useState(false); // State for modal open/close
  const [selectedUserId, setSelectedUserId] = useState(null); // State to hold selected user ID

  // Custom Delete Button Component
  const CustomDeleteButtonComponent = (props) => {
    const handleDelete = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:4000/api/users/${props.data._id}`
        );
        console.log("User deleted:", response.data);
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(response.data.mssg); // Set success message from response
      } catch (error) {
        console.error("Error deleting user:", error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.mssg); // Set error message from response
      }
    };

    return (
      <>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </>
    );
  };

  // Custom Edit Button Component
  const CustomEditButtonComponent = (props) => {
    const handleEdit = async () => {
      setSelectedUserId(props.data._id); // Set the selected user ID
      handleEditOpenModal(); // Open edit modal
    };

    return (
      <>
        <Button variant="contained" color="success" onClick={handleEdit}>
          Edit
        </Button>
      </>
    );
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleAddOpenModal = () => {
    setAddOpenModal(true);
  };

  const handleEditOpenModal = () => {
    setEditOpenModal(true);
  };

  const handleAddCloseModal = () => {
    setAddOpenModal(false);
  };

  const handleEditCloseModal = () => {
    setEditOpenModal(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users/")
      .then((response) => {
        setRowData(response.data);
        console.log(response.data);
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Users loaded from Database successfully"); // Set success message from response
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("There was an error fetching the user data from Database!"); // Set error message from response
      });
  }, []);

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  return (
    <>
      <Container>
        <Row>
          <center>
              <h2 style={{ margin: "10px 0" }}>User Management</h2>
          </center>  
        </Row>
        <Row>
          <div className="d-flex justify-content-end">
            <Button
              variant="contained"
              color="primary"
              className="mx-5 my-2"
              onClick={handleAddOpenModal} // Open modal when button is clicked
            >
              New User
            </Button>
          </div>
        </Row>
        <Row>
          <div className="ag-theme-quartz-dark" style={{ height: 600 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={[
                { field: "email", flex: 1, filter: true },
                { field: "role", flex: 1, filter: true },
                { field: "Edit", cellRenderer: CustomEditButtonComponent },
                { field: "Delete", cellRenderer: CustomDeleteButtonComponent },
              ]}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={paginationPageSizeSelector}
            />
          </div>
        </Row>
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
        <AddUserModal open={AddopenModal} handleClose={handleAddCloseModal} />
        <EditUserModal
          open={EditopenModal}
          handleClose={handleEditCloseModal}
          userId={selectedUserId} // Pass selected user ID to EditUserModal
        />
        {/* Render modal component */}
      </Container>
    </>
  );
};

export default User_Management;
