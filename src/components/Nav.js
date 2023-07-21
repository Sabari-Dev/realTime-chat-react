import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Config/Config";
import { updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/auth";
import logo from "../logo.png";

const Nav = () => {
  const { user } = useContext(AuthContext);
  let navigate = useNavigate();
  const handleSignOut = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/signIn");
  };
  return (
    <Navbar className="bg-body-tertiary p-0">
      <Container>
        <Navbar.Brand className="p-0">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              style={{ height: "80px", width: "150px" }}
              className="logo"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="primary" className="mx-2 px-3">
                  Profile
                </Button>
              </Link>
              <Link to="/signIn">
                <Button
                  variant="outline-primary"
                  className="mx-2 px-3"
                  onClick={handleSignOut}
                >
                  LogOut
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                <Button variant="primary" className="mx-2 px-3">
                  SignUp
                </Button>
              </Link>
              <Link to="/signIn">
                <Button variant="outline-primary" className="mx-2 px-3">
                  SignIn
                </Button>
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
