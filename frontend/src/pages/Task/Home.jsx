import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import axios from "axios";
import OpenTaskModal from "./OpenTaskModal";
import NoEditOpenTaskModal from "./NoEditOpenTaskModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Home = () => {
  const [value, setValue] = useState(0);
  const [assignedToMeRowData, setAssignedToMeRowData] = useState([]);
  const [unassignedRowData, setUnassignedRowData] = useState([]);
  const [completedRowData, setCompletedRowData] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [noEditOpenModal, setNoEditOpenModal] = useState(false); // State for modal open/close
  const [selectedTaskId, setselectedTaskId] = useState();

  // Clear stored email from localStorage
  const storedEmail = localStorage.getItem("email");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CustomOpenButtonComponent = ({ data }) => {
    const handleEdit = () => {
      // Handle opening the task detail modal or navigation
      setselectedTaskId(data._id);
      handleOpenModal();
    };

    return (
      <Button variant="contained" color="primary" onClick={handleEdit}>
        Open
      </Button>
    );
  };

  const CustomNoEditOpenButtonComponent = ({ data }) => {
    const handleEdit = () => {
      // Handle opening the task detail modal or navigation
      setselectedTaskId(data._id);
      handleNoEditOpenModal();
    };

    return (
      <Button variant="contained" color="primary" onClick={handleEdit}>
        Open
      </Button>
    );
  };

  const CustomUnAssignButtonComponent = ({ data }) => {
    const handleEdit = async () => {
      data.users = [];
      // Example of submitting taskData to backend
      try {
        const response = await axios.patch(
          `https://taskserver-99hb.onrender.com/api/tasks/${data._id}`,
          data
        );
        console.log("Task updated:", response.data);
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Task unassigned"); // Set success message from response
      } catch (error) {
        console.error("Error updating task:", error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.mssg); // Set error message from response
      }
    };

    return (
      <Button variant="contained" color="error" onClick={handleEdit}>
        UnAssign
      </Button>
    );
  };

  const CustomAssignButtonComponent = ({ data }) => {
    const handleEdit = async () => {

      console.log("Data being sent:", data);

      try {
        const response = await axios.get(`https://taskserver-99hb.onrender.com/api/users`);
        console.log("User Data:", response.data);
        const user = response.data.filter(
          (value) => value.email === storedEmail
        );
        data.users = [user[0]._id];
        try {
          const response = await axios.patch(
            `https://taskserver-99hb.onrender.com/api/tasks/${data._id}`,
            data
          );
          console.log("Task updated:", response.data);
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Task assigned to you!");
        } catch (error) {
          console.error("Error updating task:", error);
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage(error.response?.data?.mssg || "Failed to update task");
        }
      } catch (error) {
        console.error("Error collecting User Data:", error);
      }
    };

    return (
      <Button variant="contained" color="success" onClick={handleEdit}>
        Assign to me
      </Button>
    );
  };

  const dateFormatter = (params) => {
    const dateObj = new Date(params.value);
    return dateObj.toLocaleDateString();
  };

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
  const [assignedToMeColDef, setassignedToMeColDef] = useState([
    { field: "title", filter: true },
    { field: "description", filter: true },
    { field: "dueDate", filter: true, valueFormatter: dateFormatter },
    // { field: "priority", filter: true, valueFormatter: priorityFormatter },
    // { field: "status", filter: true },
    // { field: "category", filter: true },
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
    { cellRenderer: CustomOpenButtonComponent },
    { cellRenderer: CustomUnAssignButtonComponent },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [unAssignedColDef, setunAssignedColDefs] = useState([
    { field: "title", filter: true },
    { field: "description", filter: true },
    { field: "dueDate", filter: true, valueFormatter: dateFormatter },
    // { field: "priority", filter: true, valueFormatter: priorityFormatter },
    // { field: "status", filter: true },
    // { field: "category", filter: true },
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
    { cellRenderer: CustomNoEditOpenButtonComponent },
    { cellRenderer: CustomAssignButtonComponent },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [completedColDef, setcompletedColDef] = useState([
    { field: "title", filter: true },
    { field: "description", filter: true },
    { field: "dueDate", filter: true, valueFormatter: dateFormatter },
    // { field: "priority", filter: true, valueFormatter: priorityFormatter },
    // { field: "status", filter: true },
    // { field: "category", filter: true },
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
    { cellRenderer: CustomNoEditOpenButtonComponent },
  ]);

  useEffect(() => {
    axios
      .get("https://taskserver-99hb.onrender.com/api/tasks/")
      .then((response) => {
        const tasks = response.data;
        // console.log(storedEmail)
        const currentUser = storedEmail; // Replace with actual current user logic
        console.log(currentUser);

        // Map over response data and format 'users' field if needed
        const formattedTaskData = tasks.map((task) => ({
          ...task,
          users: task.users.map((user) => user.email), // Assuming 'users' field contains an array of user objects
        }));
        // Filter tasks assigned to the current user
        const assignedToMeTasks = formattedTaskData.filter(
          (task) =>
            task.users.some((userEmail) => userEmail === storedEmail) &&
            task.status !== "Completed"
        );

        const unassignedTasks = formattedTaskData.filter(
          (task) => task.users.length === 0
        );

        const completedTasks = formattedTaskData.filter(
          (task) => task.status === "Completed"
        );

        setAssignedToMeRowData(assignedToMeTasks);
        setUnassignedRowData(unassignedTasks);
        setCompletedRowData(completedTasks);
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Data loaded from DB successfully"); // Set success message from response
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.mssg); // Set success message from response
      });
  }, []);

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNoEditOpenModal = () => {
    setNoEditOpenModal(true);
  };

  const handleNoEditCloseModal = () => {
    setNoEditOpenModal(false);
  };

  return (
    <>
      <Container>
        <Row className="mt-2">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Assigned to me" />
              <Tab label="Unassigned" />
              <Tab label="Completed" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Row>
              <Col>
                <div className="ag-theme-quartz-dark" style={{ height: 600 }}>
                  <AgGridReact
                    rowData={assignedToMeRowData}
                    columnDefs={assignedToMeColDef}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                  />
                </div>
              </Col>
            </Row>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Row>
              <Col>
                <div className="ag-theme-quartz-dark" style={{ height: 600 }}>
                  <AgGridReact
                    rowData={unassignedRowData}
                    columnDefs={unAssignedColDef}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                  />
                </div>
              </Col>
            </Row>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Row>
              <Col>
                <div className="ag-theme-quartz-dark" style={{ height: 600 }}>
                  <AgGridReact
                    rowData={completedRowData}
                    columnDefs={completedColDef}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                  />
                </div>
              </Col>
            </Row>
          </TabPanel>
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
      <OpenTaskModal
        open={openModal}
        handleClose={handleCloseModal}
        taskId={selectedTaskId} // Pass selected user ID to EditUserModal
      />
      <NoEditOpenTaskModal
        open={noEditOpenModal}
        handleClose={handleNoEditCloseModal}
        taskId={selectedTaskId} // Pass selected user ID to EditUserModal
      />
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default Home;