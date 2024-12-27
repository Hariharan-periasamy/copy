import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../App.css";

const LoginRegister = () => {
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    dob: "",
    role: "user",
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email: formInput.email,
        password: formInput.password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

  
      const { token, user } = res.data;
      localStorage.setItem("token", token);
  
      if (user.department === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Invalid credentials.");
    }
  };
  
  

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      console.log(formInput);  // Log the form data being sent
      await axios.post("http://localhost:4000/api/auth/register", formInput);
      toast.success("Registration successful. You can now log in.");
      setIsRegistering(false);
    } catch (error) {
      console.error("Registration error:", error);  // Log any errors
      toast.error("Registration failed. Please try again.");
    }
  };
  

  return (
    <section className="section">
      <div className="form-section">
        {isRegistering ? (
          <div className="register-form">
            <h2>Register</h2>
            <Form onSubmit={handleRegister}>
              <Row className="mb-3">
                <Form.Group as={Col} md={6} controlId="formGridName">
                  <FloatingLabel label="Name">
                    <Form.Control
                      type="text"
                      name="name"
                      value={formInput.name}
                      onChange={handleChange}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridPhone">
                  <FloatingLabel label="Phone">
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formInput.phone}
                      onChange={handleChange}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md={6} controlId="formGridEmail">
                  <FloatingLabel label="Email">
                    <Form.Control
                      type="text"
                      name="email"
                      value={formInput.email}
                      onChange={handleChange}
                      
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridPassword">
                  <FloatingLabel label="Password">
                    <Form.Control
                      type="password"
                      name="password"
                      value={formInput.password}
                      onChange={handleChange}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md={6} controlId="formGridAddress">
                  <FloatingLabel label="Address">
                    <Form.Control
                      type="text"
                      name="address"
                      value={formInput.address}
                      onChange={handleChange}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridDob">
                  <FloatingLabel label="Date of Birth">
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formInput.dob}
                      onChange={handleChange}
                      required
                    />
                  </FloatingLabel>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md={12} controlId="formGridRole">
                  <FloatingLabel label="Role">
                  <Form.Select
                    name="department"
                    value={formInput.department}
                    onChange={handleChange}
                    required
                    >
                    <option value="">Choose a Department</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
              </Row>
              <Button variant="primary" type="submit">Register</Button>
            </Form>
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsRegistering(false)}>Login</span>
            </p>
          </div>
        ) : (
          <div className="login-form">
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formGridEmail">
                <FloatingLabel label="Email">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formInput.email}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group controlId="formGridPassword">
                <FloatingLabel label="Password">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formInput.password}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </FloatingLabel>
              </Form.Group>
              <Button variant="primary" type="submit">Login</Button>
            </Form>
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsRegistering(true)}>Sign up</span>
            </p>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </section>
  );
};

export default LoginRegister; 