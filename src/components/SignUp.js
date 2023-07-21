import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { auth, db } from "../Config/Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    loading: false,
    error: null,
  });
  const { userName, email, password, error, loading } = user;
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser({ ...user, loading: true, error: null });
    if (!userName || !email || !password) {
      setUser({ ...user, error: "Please fill all field" });
    }
    try {
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
    } catch (err) {
      console.log(err);
      setUser({ ...user, error: `${err}` });
    }
  };
  return (
    <Form className="signUp mx-auto p-4 mt-5 " onSubmit={handleSubmit}>
      <h2 className="text-center">SignUp</h2>
      <Form.Group className="mb-3">
        <Form.Label>User Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter User Name"
          name="userName"
          value={userName}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        {error ? <p className="text-danger">{error}</p> : null}
      </Form.Group>
      <Button variant="primary" type="submit">
        {loading ? "creating..." : "signUp"}
      </Button>
    </Form>
  );
};

export default SignUp;
