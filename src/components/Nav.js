import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Config/Config";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Image from "react-bootstrap/Image";
import { AuthContext } from "../context/auth";
import logo from "../logo.png";
import profileImg from "../profile.jpg";
import toast from "react-hot-toast";

const Nav = () => {
  const { user } = useContext(AuthContext);
  let navigate = useNavigate();
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    if (user) {
      const getProfile = async () => {
        const docRef = doc(db, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        setUserProfile(docSnap.data().avatar);
      };
      getProfile();
    }
  }, [userProfile, user]);
  const handleSignOut = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    toast.success("Logging out successfully!!");
    navigate("/signIn");
  };
  return (
    <Navbar className="bg-body-tertiary p-0 navbar">
      <Container>
        <Navbar.Brand className="p-0">
          <Link to={user ? "/home" : "/"}>
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
                  <Image
                    src={userProfile ? userProfile : profileImg}
                    height={"25px"}
                    width={"25px"}
                    roundedCircle
                    className="me-2"
                  />
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
                <Button variant="outline-primary" className="mx-2 px-3">
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
