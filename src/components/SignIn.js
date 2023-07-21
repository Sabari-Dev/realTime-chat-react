import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { auth, db } from "../Config/Config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [logUser, setLogUser] = useState({
    email: "",
    password: "",
    loading: false,
    error: null,
  });
  const { email, password, error, loading } = logUser;
  const handleChange = (e) => {
    setLogUser({ ...logUser, [e.target.name]: e.target.value });
  };
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogUser({ ...logUser, loading: true, error: null });
    if (!email || !password) {
      setLogUser({ ...logUser, error: "Please fill all field" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userId = result.user.uid;
      console.log(userId);
      updateDoc(doc(db, "Users", userId), {
        isOnline: true,
      });
      setLogUser({
        email: "",
        password: "",
        loading: false,
        error: null,
      });
      navigate("/home");
    } catch (err) {
      console.log(err);
      setLogUser({ ...logUser, error: `${err}` });
    }
  };
  return (
    <Form className="signUp mx-auto p-4 mt-5 " onSubmit={handleSubmit}>
      <h2 className="text-center">SignIn</h2>
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
      </Form.Group>
      {error ? <p className="text-danger">{error}</p> : null}
      <Button variant="primary" type="submit">
        {loading ? "loading..." : "LogIn"}
      </Button>
    </Form>
  );
};

export default SignIn;
