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
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  //   console.log(img);
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

  return user ? (
    <section className="w-50 mx-auto text-center">
      <div className="profile-page">
        <div className="img-area">
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
        <div className="text-area w-75 mx-auto ">
          <h3>{user.userName}</h3>
          <p>{user.email}</p>
          <hr />
          <small>{user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
