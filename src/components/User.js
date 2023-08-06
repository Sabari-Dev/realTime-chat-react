import React, { useEffect, useState } from "react";
import img from "../profile.jpg";
import { BsCircleFill } from "react-icons/bs";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Config/Config";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);
  return (
    <div
      className={`user-wrapper ${
        chat.userName === user.userName && `selected-user`
      }`}
      onClick={() => selectUser(user)}
    >
      <div className="user-info">
        <div className="user-details">
          <img src={user.avatar || img} alt="avatar" className="avatar" />
          <h5>{user.userName}</h5>
          {data?.from !== user1 && data?.unread && (
            <small className="unread bg-danger text-light px-1">New</small>
          )}
        </div>
        <div className={`user-status  ${user.isOnline ? "success" : "danger"}`}>
          <BsCircleFill />
        </div>
      </div>
      {data && (
        <p>
          <strong>{data.from === user1 ? "Me:" : ""}</strong>
          {data.text}
        </p>
      )}
    </div>
  );
};

export default User;
