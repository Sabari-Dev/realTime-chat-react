import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { auth, db } from "../Config/Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SignUp = () => {
  const [user, setUser] = useState({
    userName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});
  const { userName, gender, email, password, confirmPassword, state, loading } =
    user;
  const handleChange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleGender = (value) => {
    setUser({ ...user, gender: value });
  };
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser({ ...user, loading: true, error: null });
    console.log(user);

    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = result.user.uid;
        console.log(userId);
        setDoc(doc(db, "Users", userId), {
          uid: userId,
          ...user,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
        setUser({
          userName: "",
          email: "",
          password: "",
          loading: false,
          error: null,
        });
        navigate("/signIn");
      } else {
        setErrors(validationErrors);
        setTimeout(() => {
          setErrors({});
        }, 4000);
        setUser({ ...user, loading: false });
      }
    } catch (err) {
      console.log(err);
      setUser({ ...user, error: `${err}` });
    }
  };
  const validateForm = () => {
    let validationErrors = {};
    if (!userName) {
      validationErrors.userName = `Name required *`;
    }
    if (!gender) {
      validationErrors.gender = "Select gender *";
    }
    if (!email) {
      validationErrors.email = `email required *`;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      validationErrors.email = `Email is invalid *`;
    }
    if (!password) {
      validationErrors.password = `Enter password`;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      validationErrors.password = `At least 8 characters long,
Contains at least one uppercase letter,
Contains at least one lowercase letter,
Contains at least one digit,
Allows special characters`;
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = `Enter confirm password`;
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = `Password and confirm Password not same `;
    }
    if (!state) {
      validationErrors.state = "State selection required";
    }
    return validationErrors;
  };
  return (
    <Form className="signUp mx-auto p-4 mt-3 " onSubmit={handleSubmit}>
      <h2 className="text-center">SignUp</h2>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter User Name"
            name="userName"
            value={userName}
            onChange={handleChange}
          />
          {errors.userName && (
            <p className="message text-danger">{errors.userName}</p>
          )}
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="message text-danger">{errors.email}</p>
          )}
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label className="me-3">Gender</Form.Label>
        <Form.Check
          inline
          label="Male"
          name="gender"
          type="radio"
          value="male"
          id="male"
          onChange={(e) => handleGender(e.target.value)}
        />
        <Form.Check
          inline
          label="Female"
          name="gender"
          type="radio"
          value="female"
          id="female"
          onChange={(e) => handleGender(e.target.value)}
        />
        <Form.Check
          inline
          label="others"
          name="gender"
          type="radio"
          value="others"
          id="others"
          onChange={(e) => handleGender(e.target.value)}
        />
        {errors.gender && (
          <p className="message text-danger">{errors.gender}</p>
        )}
      </Form.Group>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="message text-danger">{errors.password}</p>
          )}
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="formGroupCPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="message text-danger">{errors.confirmPassword}</p>
          )}
        </Form.Group>
      </Row>
      <Form.Group>
        <Form.Label>State</Form.Label>
        <Form.Select name="state" value={state} onChange={handleChange}>
          <option value="">Select State</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
        </Form.Select>
        {errors.state && <p className="message text-danger">{errors.state}</p>}
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        {loading ? "creating..." : "signUp"}
      </Button>
    </Form>
  );
};

export default SignUp;
