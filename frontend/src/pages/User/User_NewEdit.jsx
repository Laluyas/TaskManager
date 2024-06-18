import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { Box, Button, TextField } from "@mui/material";

const User_NewEdit = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted");
  };

  return (
    <>
    <Container>
      <Row>
        <Col xs={1}>
          <Sidebar />
        </Col>
        <Col xs={11}>
          <h3 style={{ margin: '6px 16px' }}>User New/Edit Page</h3>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center" style={{ height: 'calc(100vh - 100px)' }}>
        <Col xs={6}>
          <Box p={3} boxShadow={3} borderRadius={5}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <TextField
                  fullWidth
                  id="outlined-email"
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Row>
              <Row className="mb-3">
                <TextField
                  fullWidth
                  id="outlined-password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Row>
              <Row className="d-flex justify-content-center">
                <Button variant="contained" type="submit" size="medium" style={{ width: '100px' }}>
                  Save
                </Button>
              </Row>
            </Form>
          </Box>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default User_NewEdit;
