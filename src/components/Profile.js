import React, { useEffect, useState } from "react";
import image from "../profile.jpg";
import { BsFillCameraFill, BsFillTrash3Fill } from "react-icons/bs";
import { storage, auth, db } from "../Config/Config";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { deleteUser } from "firebase/auth";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const [editedUserName, setEditedUserName] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedState, setEditedState] = useState("");

  //   console.log(img);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid))
      .then((docSnap) => {
        if (docSnap.exists) {
          setUser(docSnap.data());
          //   console.log(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          //   console.log(snap.ref.fullPath);
          //   console.log(url);

          await updateDoc(doc(db, "Users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);
  const navigate = useNavigate();
  const deleteProfile = async () => {
    try {
      const confirm = window.confirm("Are you sure to delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "Users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    if (window.confirm("Are you sure delete this account?")) {
      await deleteDoc(doc(db, "Users", auth.currentUser.uid));
      deleteUser(auth.currentUser.uid).then(() => {
        alert("user deleted successfully!!");
        navigate("/");
      });
    }
  };
  const handleGender = (value) => {
    setEditedGender(value);
  };
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        userName: editedUserName,
        gender: editedGender,
        state: editedState,
      });
      setUser((prevUser) => ({
        ...prevUser,
        userName: editedUserName,
        gender: editedGender,
        state: editedState,
      }));
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return user ? (
    <section className="w-50 sm-ms-2 l-mx-auto ">
      <div className="profile-page text-center">
        <div className="img-area ">
          <img
            src={user.avatar || image}
            alt="avatar"
            style={{ height: "200px", width: "200px" }}
          />
          <div className="over">
            <div>
              <label htmlFor="img">
                <BsFillCameraFill />
              </label>
              {user.avatar ? (
                <BsFillTrash3Fill
                  className="text-danger ms-3"
                  onClick={deleteProfile}
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="img"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="sm-w-100 text-area xl-w-75 sm-ms-1 xl-mx-auto">
          <table className="w-100 text-start">
            <tr>
              <th>Name</th>
              <th>:</th>
              <td style={{ textTransform: "capitalize" }}>{user.userName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <th>:</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <th>:</th>
              <td style={{ textTransform: "capitalize" }}>{user.gender}</td>
            </tr>
            <tr>
              <th>State</th>
              <th>:</th>
              <td style={{ textTransform: "capitalize" }}>{user.state}</td>
            </tr>
          </table>
          <hr />
          <div className="buttons">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                setEditedUserName(user.userName);
                setEditedGender(user.gender);
                setEditedState(user.state);
                handleShow();
              }}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
            <Link to="/home" className="btn btn-outline-secondary ms-2">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mx-auto p-4 mt-3 ">
            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter User Name"
                  name="userName"
                  value={editedUserName}
                  onChange={(e) => setEditedUserName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={user.email}
                  disabled
                />
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
            </Form.Group>

            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Select
                name="state"
                value={editedState}
                onChange={(e) => setEditedState(e.target.value)}
              >
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
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  ) : null;
};

export default Profile;
